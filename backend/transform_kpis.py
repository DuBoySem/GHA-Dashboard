import statistics
import traceback
import csv
import json
import os
from datetime import datetime
from dataclasses import asdict, dataclass,field
from statistics import stdev, median
from typing import DefaultDict, dataclass_transform

#setup the base folder path
root_path = os.path.dirname(os.path.abspath(__file__))
# paths to the files
raw_data_path = ""
kpis_path = ""
#raw data container
raw_dict = []

#KPIs strures
#genral
#by workflow

@dataclass
class MedianChurnPerWorkflow:
    workflow_name: str
    median_value: float
    # to prevent each instance of class object to share the same dict
    week_med_trend: dict = field(default_factory=dict)
    month_med_trend: dict = field(default_factory=dict)

@dataclass
class MedianDurationPerWorkflowExecution:
    workflow_name: str
    execution_number: int
    duration_median: float
    # to prevent each instance of class object to share the same dict
    week_median_trend: dict = field(default_factory=dict)
    month_median_trend: dict = field(default_factory=dict)

@dataclass
class MedianPassedTestsRatePerWorkflow:
    workflow_name: str
    execution_number: int
    median_success_rate: float
    median_passed_value: float
    median_test_value: float
    # to prevent each instance of class object to share the same dict
    week_median_trend: dict = field(default_factory=dict)
    month_median_trend: dict = field(default_factory=dict)

# ----old metrics-----
@dataclass
class StdDevOfWorkflowExecutions:
    workflow_name: str
    duration_stddev: float
    duration_mad: float
    # to prevent each instance of class object to share the same dict
    week_mad_trend: dict = field(default_factory=dict)
    month_mad_trend: dict = field(default_factory=dict)


@dataclass
class AverageFaillureRatePerIssuer:
    issuer_name: str
    faillure_rate: float
    execution_number: int


@dataclass
class AverageFaillureRatePerWorkflow:
    workflow_name: str
    faillure_rate: float
    execution_number: int
    # to prevent each instance of class object to share the same dict
    week_average_trend: dict = field(default_factory=dict)
    month_average_trend: dict = field(default_factory=dict)


@dataclass
class AverageFailedWorkflowExecutionTime:
    workflow_name: str
    median_duration: float
    total_fails: int
    # to prevent each instance of class object to share the same dict
    week_median_trend: dict = field(default_factory=dict)
    month_median_trend: dict = field(default_factory=dict)


@dataclass
class AverageChangedTestsPerWorkflowExecution:
    workflow_name: str
    average_churn: float


@dataclass
class PullRequestTriggersTrend:
    workflow_name: str
    # to prevent each instance of class object to share the same dict
    week_triggers_trend: dict = field(default_factory=dict)
    month_triggers_trend: dict = field(default_factory=dict)


#other
@dataclass
class AveragePassedTestsPerWorkflowExcecution:
    workflow_name: str
    median_sucess_rate: float
    median_test_value: float
    week_median_success_rate_trend: dict = field(default_factory=dict)
    month_median_success_rate_trend: dict = field(default_factory=dict)
    week_median_test_value_trend: dict = field(default_factory=dict)
    month_median_test_value__trend: dict = field(default_factory=dict)


@dataclass
class BuildFileTypesCausingFaillures:
    file_type: str
    faillure_rate: float


@dataclass
class AverageExecutionFailsByTeamSize:
    team_size: int
    average_faillure_rate: float


#write final KPIs in json file
def write_json(kpis_path, kpis_dict):
    #write the KPIs in a single json file
    with open(kpis_path, mode="w", encoding="utf8-") as kpis:
        json.dump(kpis_dict, kpis, indent=4)


#reads row data from csv and parse it
def parse_raw_data(raw_data_path, raw_dict):
    #resets raw_dict variable
    raw_dict.clear()
    #open csv file that contains the row data
    with open(raw_data_path, mode="r", newline="", encoding="utf-8") as csv_content:
        #reads the content
        parser = csv.DictReader(csv_content)
        for row in parser:
            #store in local dict
            raw_dict.append(row)


def compute_kpis(raw_dict):
    grouped_workflows = DefaultDict(
        lambda: {
            "fail": 0,
            "total": 0,
            "trend_conclusion_timestamps": DefaultDict(lambda: DefaultDict(lambda: {"total":0, "fail":0})),
            "durations": [],
            "failed_durations": [],
            "churn_values": [],
            "tests_success_rate": [],
            "tests_passed_count": [],
            "tests_ran_count": [],
            "trend_tests_data_timestamps":DefaultDict(lambda: DefaultDict(list)),
            "trend_churn_timestamps": DefaultDict(lambda: DefaultDict(list)),
            "trend_duration_timestamps": DefaultDict(lambda: DefaultDict(list)),
            "trend_failed_duration_timestamps": DefaultDict(lambda: DefaultDict(list)),
            "trend_triggers_timestamps": DefaultDict(lambda: DefaultDict(int)),
            "sum_fail_time": 0,
            "total_times_tests_ran": 0,
            "total_times_tests_ran_passed": 0,
            "sum_test_change": 0.0,
            "sum_test_passed_rate": 0.0,
        }
    )
    grouped_issuers = DefaultDict(lambda: {"fail": 0, "total": 0})
    #----- !!! README !!! ------
    # filtering outlier builds
    # GHAMiner writes builds from oldest to newest (first line of csv = newest)
    # When generating KPIs, we read csv from top to bottom (from newest to oldest)
    # To remove outliers, first line will be stored in buffer to compare time frames with next one
    # this only applies for builds of the same workflow
    #--------------------------
    #holds previous row data to check if current one is a valid row or not
    last_created_at_per_workflow = {}
    #iterate over the raw data
    for row in raw_dict:
        #for workflows
        workflow = row.get("workflow_name")
        #---filtering logic
        created_at_str = row.get("created_at")
        updated_at_str = row.get("updated_at")

        if not (workflow and created_at_str and updated_at_str):
            continue

        #convert string to Date type
        try:
            created_at = datetime.strptime(created_at_str, "%Y-%m-%dT%H:%M:%SZ")
            updated_at = datetime.strptime(updated_at_str, "%Y-%m-%dT%H:%M:%SZ")
        except ValueError:
            continue

        prev_created_at = last_created_at_per_workflow.get(workflow)

        #skip if the current row ends after the previous one began
        if prev_created_at and updated_at > prev_created_at:
            continue
        #---- filtering logic end

        # increments total number of execution of specific workflow
        grouped_workflows[workflow]["total"] += 1
        # skips the first 10 execution of a workflow
        if grouped_workflows[workflow]["total"]>10:
            #-------------------
            # get workflow conclusion
            conclusion = row.get("conclusion")
            # get build duration
            duration = float(row.get("build_duration", 0))
            # churn
            churn = float(row.get("gh_src_churn",0))
            # append build duration
            grouped_workflows[workflow]["durations"].append(duration)
            # append timestap of workflow for trends
            month_key = get_month(row.get("created_at"))
            week_key = get_week(row.get("created_at"))
            #-- trends --
            #--- mad values
            # --trend by month
            grouped_workflows[workflow]["trend_duration_timestamps"]["by_month"][month_key].append(duration)
            # --trend by week
            grouped_workflows[workflow]["trend_duration_timestamps"]["by_week"][week_key].append(duration)
            #---
            #--- failure rate
            #trends by month
            grouped_workflows[workflow]["trend_conclusion_timestamps"]["by_month"][month_key]["total"] +=1
            #trends by week
            grouped_workflows[workflow]["trend_conclusion_timestamps"]["by_week"][week_key]["total"] +=1
            #---
            #---churn values
            # -- trend by month
            grouped_workflows[workflow]["trend_churn_timestamps"]["by_month"][month_key].append(churn)
            #trends by week
            grouped_workflows[workflow]["trend_churn_timestamps"]["by_week"][week_key].append(churn)
            #---
            #--- pull requets triggers
            if row.get("workflow_event_trigger") == "pull_request":
                #trends by month
                grouped_workflows[workflow]["trend_triggers_timestamps"]["by_month"][month_key] +=1
                #trends by week
                grouped_workflows[workflow]["trend_triggers_timestamps"]["by_week"][week_key] +=1
            else:
                #trends by month
                grouped_workflows[workflow]["trend_triggers_timestamps"]["by_month"][month_key] +=0
                #trends by week
                grouped_workflows[workflow]["trend_triggers_timestamps"]["by_week"][week_key] +=0
            #---
            #-- trends end --
            # test section
            # checks if tests got ran this execution
            if row["tests_ran"] == "True":
                #----
                process_tests(grouped_workflows, row, workflow,month_key,week_key)
                #----
            # test churn
            # prevent edge case of dividing by 0
            if row["gh_test_churn"]:
                grouped_workflows[workflow]["sum_test_change"] += int(row["gh_test_churn"])

            # for issuers
            # get issuer name
            issuer_name = row.get("issuer_name")
            # increment number of build executed by issuer
            grouped_issuers[issuer_name]["total"] += 1

            # checks if excution was a failure to increment it
            if conclusion == "failure":
                #---
                process_failure(grouped_workflows, duration, workflow, grouped_issuers, issuer_name, row.get("created_at"))
                #---
            #---------------
        # Record the current created_at for this workflow
        last_created_at_per_workflow[workflow] = created_at
    #-----
    wf_fail_rate = []
    wf_PR_triggers_trend = []
    issuer_fail_rate = []
    wf_stddev = []
    wf_fail_duration = []
    wf_tests_passed = []
    wf_test_churn = []
    wf_churn = []
    wf_median_dur = []
    wf_passed_tests = []

    normalize_timestamps(grouped_workflows)
    #---
    generate_metrics(grouped_workflows, grouped_issuers, wf_fail_rate, wf_PR_triggers_trend, issuer_fail_rate, wf_stddev, wf_fail_duration, wf_tests_passed, wf_test_churn,wf_churn,wf_median_dur, wf_passed_tests)
    #---

    #setting up structure
    kpis_json = {
        "AverageFaillureRatePerWorkflow": [asdict(ele) for ele in wf_fail_rate],
        "StdDevWorkflowExecutions": [asdict(ele) for ele in wf_stddev],
        "AverageFaillureRatePerIssuer": [asdict(ele) for ele in issuer_fail_rate],
        "PullRequestTriggersTrend": [asdict(ele) for ele in wf_PR_triggers_trend],
        "AveragePassedTestsPerWorkflowExcecution": [
            asdict(ele) for ele in wf_tests_passed
        ],
        "AverageChangedTestsPerWorkflowExecution": [
            asdict(ele) for ele in wf_test_churn
        ],
        "AverageFailedWorkflowExecutionTime": [asdict(ele) for ele in wf_fail_duration],
        "MedianChurnPerWorkflow": [asdict(ele) for ele in wf_churn],
        "MedianDurationPerWorkflowExecution": [asdict(ele) for ele in wf_median_dur],
        "MedianPassedTestsratePerWorkflow": [asdict(ele) for ele in wf_passed_tests]
    }
    return kpis_json

def generate_metrics(grouped_workflows, grouped_issuers, wf_fail_rate,wf_PR_triggers_trend, issuer_fail_rate, wf_stddev, wf_fail_duration, wf_tests_passed, wf_test_churn, wf_churn,wf_median_dur, wf_passed_tests):
    for wf_name, stats in grouped_workflows.items():
        #remove 10 first executions from total to have accurate values and metrics
        if stats["total"] > 10:
            stats["total"]-=10
        #create line of data for failure rate per wf
        fail_rate = round(stats["fail"] / stats["total"], 2)
        #--trends failure rate--
        # by month
        rate_month_trend = generate_average_fail_rate_trend(stats["trend_conclusion_timestamps"]["by_month"])
        # by week
        rate_week_trend = generate_average_fail_rate_trend(stats["trend_conclusion_timestamps"]["by_week"])
        #--- trends failure rate end ---
        wf_fail_rate.append(AverageFaillureRatePerWorkflow(workflow_name=wf_name, faillure_rate=fail_rate,execution_number=stats["total"],week_average_trend=rate_week_trend, month_average_trend=rate_month_trend))

        # ---general duration metrics---
        # stddev & mad
        durations = stats["durations"]
        stddev = round(stdev(durations), 2) if len(durations) > 1 else 0.0
        median_durations = statistics.median(durations) if len(durations)>1 else 0.0
        mad = statistics.median([abs(x - median_durations) for x in durations]) if len(durations)>1 else 0
        # -- trends mad duration --
        # by month
        monthly_trend = generate_mad_trend(stats["trend_duration_timestamps"]["by_month"])
        # by week
        weekly_trend = generate_mad_trend(stats["trend_duration_timestamps"]["by_week"])
        # -- trends mad duration end --
        #create line of data for stddev of workdlows
        wf_stddev.append(
            StdDevOfWorkflowExecutions(workflow_name=wf_name, duration_stddev=stddev, duration_mad=mad,week_mad_trend=weekly_trend, month_mad_trend=monthly_trend)
        )
        # median durations
        # -- trends median duration --
        # by month
        med_month = generate_median_trend(stats["trend_duration_timestamps"]["by_month"])
        # by week
        med_week =generate_median_trend(stats["trend_duration_timestamps"]["by_week"])
        # -- trends median duration end --
        wf_median_dur.append(MedianDurationPerWorkflowExecution(workflow_name=wf_name,execution_number=stats["total"], duration_median=median_durations, week_median_trend=med_week, month_median_trend=med_month))

        # ---churn---
        churn_val = stats["churn_values"]
        median_churn = statistics.median(churn_val) if len(churn_val)>1 else 0
        # --- trends churn ---
        # by month
        churn_month = generate_median_trend(stats["trend_churn_timestamps"]["by_month"])
        #--
        # by week
        churn_week = generate_median_trend(stats["trend_churn_timestamps"]["by_week"])
        wf_churn.append(MedianChurnPerWorkflow(workflow_name=wf_name, median_value=median_churn,week_med_trend=churn_week, month_med_trend=churn_month))

        # ---pull request triggers---
        # by month
        triggers_month_trend = stats["trend_triggers_timestamps"]["by_month"]
        # by week
        triggers_week_trend = stats["trend_triggers_timestamps"]["by_week"] 
        # ---pull request triggers end---
        # create line of data for pull request triggers trend
        wf_PR_triggers_trend.append(PullRequestTriggersTrend( workflow_name=wf_name, week_triggers_trend=triggers_week_trend, month_triggers_trend=triggers_month_trend))

        #---median execution time of failling workflow---
        fail_median_dur = statistics.median(stats["failed_durations"]) if len(stats["failed_durations"])>1 else 0.0
        # -- trends
        # by month
        monthly_trend = generate_median_trend(stats["trend_failed_duration_timestamps"]["by_month"])
        # by week
        weekly_trend = generate_median_trend(stats["trend_failed_duration_timestamps"]["by_week"])
        wf_fail_duration.append(AverageFailedWorkflowExecutionTime(workflow_name=wf_name, median_duration=fail_median_dur, total_fails=stats["fail"], week_median_trend=weekly_trend, month_median_trend=monthly_trend))

        # -- tests part --
        # changed tests--
        avg_changed_tests = stats["sum_test_change"] // stats["total"]
        wf_test_churn.append(
            AverageChangedTestsPerWorkflowExecution(workflow_name=wf_name, average_churn=avg_changed_tests)
        )
        # passed tests
        if stats["total_times_tests_ran_passed"] > 0:
            avg_passed_tests = (stats["sum_test_passed_rate"] / stats["total_times_tests_ran_passed"])
            # wf_tests_passed.append(
            #     AveragePassedTestsPerWorkflowExcecution(workflow_name=wf_name, average_success_rate=avg_passed_tests)
            # )
        # median passed tests
        median_success_rate = statistics.median(stats["tests_success_rate"]) if len(stats["tests_success_rate"]) else 0.0
        median_passed_count = int(statistics.median(stats["tests_passed_count"]) if len(stats["tests_passed_count"]) else 0)
        median_ran_count = int(statistics.median(stats["tests_ran_count"]) if len(stats["tests_ran_count"]) else 0)
        # trends
        # by month
        test_trend_month = generate_median_data_for_tests(stats["trend_tests_data_timestamps"]["by_month"])
        # by weeks
        test_trend_week = generate_median_data_for_tests(stats["trend_tests_data_timestamps"]["by_week"])
        #---
        wf_passed_tests.append(MedianPassedTestsRatePerWorkflow(workflow_name=wf_name, execution_number=stats["total_times_tests_ran_passed"], median_success_rate=median_success_rate,median_passed_value=median_passed_count, median_test_value=median_ran_count, week_median_trend=test_trend_week, month_median_trend=test_trend_month))
        # -- tests end --
    #issuer metrics
    for iss_name, stats in grouped_issuers.items():
        iss_fail_rate = round(stats["fail"] / stats["total"], 2)
        issuer_fail_rate.append(
            AverageFaillureRatePerIssuer(
                issuer_name=iss_name, faillure_rate=iss_fail_rate,execution_number=stats["total"]
            )
        )

def generate_median_trend(timestamps):
    median_trend = {}
    for time, values in timestamps.items():
        if not values:
            median_trend[time] = {"median": 0.0, "count": 0}
            continue
        median = statistics.median(values)
        median_trend[time]= {"median": round(median, 2), "count": len(values)}
    return median_trend


def generate_median_data_for_tests(timestamps):
    median_trend = {}
    for time, values in timestamps.items():
        if not values:
            median_trend[time] = {"rate":0.0, "passed_count":0, "total_tests":0}
            continue
        #get all values
        rate = [value.get("rate", 0.0) for value in values]
        passed_count = [value.get("passed_count", 0) for value in values]
        total_tests = [value.get("total_tests", 0) for value in values]
        med_rate = statistics.median(rate) if len(rate) > 1 else 0.0
        med_passed = statistics.median(passed_count) if len(passed_count) > 1 else 0
        med_total = statistics.median(total_tests) if len(total_tests) > 1 else 0
        #write data
        median_trend[time] = {"rate":med_rate, "passed_count":int(med_passed), "total_tests":int(med_total)}
    return median_trend


def generate_average_fail_rate_trend(timestamps):
    rate_trend = {}
    for time, count in timestamps.items():
        total = count.get("total",0)
        fail = count.get("fail",0)
        if total == 0:
            rate_trend[time] = {"rate":0.0,"total":0}
            continue
        rate_trend[time] = {"rate":round(float(fail/total), 2),"total":total}
    return rate_trend


def generate_mad_trend(timestamps):
    mad_trend = {}
    for time, durations in timestamps.items():
        if not durations:
            mad_trend[time] = {"mad":0.0, "count":0}
            continue
        median_duration = statistics.median(durations)
        deviations = [abs(dur - median_duration) for dur in durations]
        mad_duration = statistics.median(deviations)
        mad_trend[time] = {"mad":round(mad_duration, 2),"count":len(durations)}
    return mad_trend


def process_tests(grouped_workflows, row, workflow,month_key,week_key):
    #increment number of times the tests got ran in workflow execution
    grouped_workflows[workflow]["total_times_tests_ran"] += 1
    #prevent edge case of dividing by 0
    #tests ran in single execution
    tests_ran = float(row["tests_total"]) - float(row["tests_skipped"])
    if (tests_ran) > 0:
        grouped_workflows[workflow]["total_times_tests_ran_passed"] += 1
        # passed tests rate
        passed_count = int(row["tests_passed"])
        pass_rate = (float(passed_count)) / (tests_ran)
        grouped_workflows[workflow]["sum_test_passed_rate"] += pass_rate
        # appen pass rate of single execution
        grouped_workflows[workflow]["tests_success_rate"].append(pass_rate)
        #append passed tests number
        grouped_workflows[workflow]["tests_passed_count"].append(passed_count)
        # append total number of tests
        grouped_workflows[workflow]["tests_ran_count"].append(int(tests_ran))
        # trends
        # by month
        grouped_workflows[workflow]["trend_tests_data_timestamps"]["by_month"][month_key].append({"rate":pass_rate, "passed_count":passed_count, "total_tests":tests_ran})
        # by week
        grouped_workflows[workflow]["trend_tests_data_timestamps"]["by_week"][week_key].append({"rate":pass_rate, "passed_count":passed_count, "total_tests":tests_ran})


def process_failure(grouped_workflows, duration, workflow,grouped_issuers, issuer_name, time):
    # increment number of failed times for the workflow
    grouped_workflows[workflow]["fail"] += 1
    # adds duration of the failed execution
    grouped_workflows[workflow]["sum_fail_time"] += duration
    grouped_workflows[workflow]["failed_durations"].append(duration)
    # trend data
    # --trend by month
    grouped_workflows[workflow]["trend_failed_duration_timestamps"]["by_month"][get_month(time)].append(duration)
    # --trend by week
    grouped_workflows[workflow]["trend_failed_duration_timestamps"]["by_week"][get_week(time)].append(duration)
    #trends by month
    grouped_workflows[workflow]["trend_conclusion_timestamps"]["by_month"][get_month(time)]["fail"] +=1
    #trends by week
    grouped_workflows[workflow]["trend_conclusion_timestamps"]["by_week"][get_week(time)]["fail"] +=1
    # increment number of failed times for the issuer
    grouped_issuers[issuer_name]["fail"] += 1

def get_week(timestamp):
    dt = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
    #format:(2025, 29, 1)
    iso_year, iso_week, _ = dt.isocalendar()
    #format: "2025-W29"
    return f"{iso_year}-W{iso_week:02d}"

def get_month(timestamp):
    dt = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
    #format "2025-07"
    return dt.strftime("%Y-%m")

# normalise date (add missing timestamps and sets the value to 0)
def normalize_timestamps(grouped_workflows):
    timestamps = DefaultDict(set)
    # get all timestamps for each metric
    # iterate over each workflow
    for workflow_element in grouped_workflows.values():
        #iterate over each property from each workflow to get the "timestamps"
        for property, property_data in workflow_element.items():
            #check if there is "timestamps" in property name
            if "timestamps" in property:
                #iterate over timestamps keys (by month or by week)
                for time_type, data in property_data.items():
                    timestamps[(property, time_type)].update(data.keys())

    #normalize timestamps
    for workflow_element in grouped_workflows.values():
        for (property,time_type), timestamp_values in timestamps.items():
            property_data=workflow_element[property]
            time_group = property_data[time_type]
            #check property
            #set values of missing timestamps for the conclusion of executions
            if property == "trend_conclusion_timestamps":
                def_val = lambda: {"total":0, "fail":0}
            #set values of missing timestamps for the workflow duration trends
            elif "duration" in property:
                def_val = lambda: [0]
            #set values for test trends
            elif property == "trend_tests_data_timestamps":
                def_val = lambda: [{"rate": 0.0, "passed_count": 0, "total_tests": 0}]
            else:
                def_val = lambda: 0

            #fill with new timestamps
            for timestamp_val in timestamp_values:
                if timestamp_val not in time_group:
                    time_group[timestamp_val] = def_val()

            #sort the timestamps
            workflow_element[property][time_type] = dict(sorted(time_group.items()))


#main function
def compute(csv_path_read:str,json_path_write:str):
    raw_data_path = csv_path_read
    kpis_path = json_path_write
    #----
    #uncomment to test trend values
    #parse_raw_data(raw_data_path, raw_dict)
    #test_mad_trends(raw_dict)
    #----
    try:
        #parse csv data
        parse_raw_data(raw_data_path, raw_dict)
        #compute and transform that csv data into kpis
        kpis_dict = compute_kpis(raw_dict)
        #writes computed data in json file
        write_json(kpis_path,kpis_dict)
        #return kpis dict to send it to front end
        return kpis_dict
    except Exception as e:
        print("[KPI transformer] error: ", e)
        traceback.print_exc()


# ----test functions---- #
#uncomment this function in the "compute" function and comment the try catch statement
def test_mad_trends(raw_dict):
    by_month = test_compute_mad_trend_by_month(raw_dict)
    print("---results; by month---")
    print(by_month)
    by_week = test_compute_mad_trend_by_week(raw_dict)
    print("---results; by month---")
    print(by_week)


def test_compute_mad_trend_by_month(raw_dict):
    workflow_executions = DefaultDict(list)
    last_created_at_per_workflow = {}

    for row in raw_dict:
        workflow = row.get("workflow_name")
        created_at_str = row.get("created_at")
        updated_at_str = row.get("updated_at")

        if not (workflow and created_at_str and updated_at_str):
            continue

        try:
            created_at = datetime.fromisoformat(created_at_str)
            updated_at = datetime.fromisoformat(updated_at_str)
            duration = float(row.get("build_duration", 0))
        except (ValueError, TypeError):
            continue

        #check if this execution ends after the previous one started
        last_created = last_created_at_per_workflow.get(workflow)
        if last_created and updated_at > last_created:
            continue

        #record the current created_at as the last seen one
        last_created_at_per_workflow[workflow] = created_at

        month_key = get_month(created_at_str)
        workflow_executions[workflow].append((month_key, duration))

    workflow_mad_by_month: dict[str, dict[str, float]] = {}

    for workflow, entries in workflow_executions.items():
        if len(entries) > 10:
            #skip the 10 first executions
            entries = entries[10:]
            monthly_values = DefaultDict(list)
            for month_key, duration in entries:
                monthly_values[month_key].append(duration)

            mad_by_month = {}
            for month, values in monthly_values.items():
                #uncomment to see each duration for each timestamp
                #print(f"[DEBUG] Workflow: {workflow}, Month: {month}, Values: {values}")
                med = median(values)
                deviations = [abs(x - med) for x in values]
                mad_val = median(deviations) if deviations else 0.0
                mad_by_month[month] = round(mad_val, 2)

            workflow_mad_by_month[workflow] = mad_by_month
    return workflow_mad_by_month

def test_compute_mad_trend_by_week(raw_dict):
    workflow_executions = DefaultDict(list)
    last_created_at_per_workflow = {}

    for row in raw_dict:
        workflow = row.get("workflow_name")
        created_at_str = row.get("created_at")
        updated_at_str = row.get("updated_at")

        if not (workflow and created_at_str and updated_at_str):
            continue

        try:
            created_at = datetime.fromisoformat(created_at_str)
            updated_at = datetime.fromisoformat(updated_at_str)
            duration = float(row.get("build_duration", 0))
        except (ValueError, TypeError):
            continue

        last_created = last_created_at_per_workflow.get(workflow)
        if last_created and updated_at > last_created:
            continue

        last_created_at_per_workflow[workflow] = created_at

        week_key = get_week(created_at_str)
        workflow_executions[workflow].append((week_key, duration))

    workflow_mad_by_week: dict[str, dict[str, float]] = {}

    for workflow, entries in workflow_executions.items():
        if len(entries) > 10:
            #skip the 10 first lines
            entries = entries[10:]
            weekly_values = DefaultDict(list)
            for week_key, duration in entries:
                weekly_values[week_key].append(duration)

            mad_by_week = {}
            for week, values in weekly_values.items():
                #uncomment to see each duration for each timestamp
                #print(f"[DEBUG] Workflow: {workflow}, Week: {week}, Values: {values}")
                med = median(values)
                deviations = [abs(x - med) for x in values]
                mad_val = median(deviations) if deviations else 0.0
                mad_by_week[week] = round(mad_val, 2)

            workflow_mad_by_week[workflow] = mad_by_week

    return workflow_mad_by_week
#--- test function END ----

if __name__ == "__main__":
    print("transform executed from terminal!!!!")
