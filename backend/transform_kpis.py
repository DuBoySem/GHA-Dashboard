import statistics
import traceback
import csv
import json
import os
from datetime import datetime
from dataclasses import asdict, dataclass,field
from statistics import stdev, median
from typing import DefaultDict, dataclass_transform

# setup the base folder path
root_path = os.path.dirname(os.path.abspath(__file__))
# paths to the files
raw_data_path = ""
kpis_path = ""
# raw data container
raw_dict = []

# KPIs strures
# genral
# by workflow

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
    average_duration: float
    fail_mad: float
    # to prevent each instance of class object to share the same dict
    week_mad_trend: dict = field(default_factory=dict)
    month_mad_trend: dict = field(default_factory=dict)


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
    average_success_rate: float


@dataclass
class BuildFileTypesCausingFaillures:
    file_type: str
    faillure_rate: float


@dataclass
class AverageExecutionFailsByTeamSize:
    team_size: int
    average_faillure_rate: float


# write final KPIs in json file
def write_json(kpis_path, kpis_dict):
    # write the KPIs in a single json file
    # print(f"[transform_kpis] writing path: {kpis_path}")
    # print(f"[transform_kpis]kpis data: {kpis_dict}")
    with open(kpis_path, mode="w", encoding="utf8-") as kpis:
        json.dump(kpis_dict, kpis, indent=4)


# reads row data from csv and parse it
def parse_raw_data(raw_data_path, raw_dict):
    #resets raw_dict variable
    raw_dict.clear()
    # open the csv file that contains the row data
    with open(raw_data_path, mode="r", newline="", encoding="utf-8") as csv_content:
        # reads the content
        parser = csv.DictReader(csv_content)
        for row in parser:
            # store in local dict
            raw_dict.append(row)


def compute_kpis(raw_dict):
    grouped_workflows = DefaultDict(
        lambda: {
            "fail": 0,
            "total": 0,
            "trend_conclusion_timestamps": DefaultDict(lambda: DefaultDict(lambda: {"total":0, "fail":0})),
            "durations": [],
            "failed_durations": [],
            "trend_duration_timestamps": DefaultDict(lambda: DefaultDict(list)),
            "trend_failed_duration_timestamps": DefaultDict(lambda: DefaultDict(list)),
            # can be used to get fail rate trends for pull request triggers not implemented yet
            # "trend_triggers_timestamps": DefaultDict(lambda: DefaultDict(lambda:{"total":0})),
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
    # holds previous row data to check if current one is a valid row or not
    last_created_at_per_workflow = {}
    # iterate over the raw data
    for row in raw_dict:
        # for workflows
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

        # Skip if the current row ends after the previous one began
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
            #--- pull requets triggers
            if row.get("workflow_event_trigger") == "pull_request":
                #trends by month
                # grouped_workflows[workflow]["trend_triggers_timestamps"]["by_month"][month_key]["total"] +=1
                grouped_workflows[workflow]["trend_triggers_timestamps"]["by_month"][month_key] +=1
                #trends by week
                # grouped_workflows[workflow]["trend_triggers_timestamps"]["by_week"][week_key]["total"] +=1
                grouped_workflows[workflow]["trend_triggers_timestamps"]["by_week"][week_key] +=1
            else:
                #trends by month
                # grouped_workflows[workflow]["trend_triggers_timestamps"]["by_month"][month_key]["total"] +=0
                grouped_workflows[workflow]["trend_triggers_timestamps"]["by_month"][month_key] +=0
                #trends by week
                # grouped_workflows[workflow]["trend_triggers_timestamps"]["by_week"][week_key]["total"] +=0
                grouped_workflows[workflow]["trend_triggers_timestamps"]["by_week"][week_key] +=0
            #---
            #-- trends end --
            # test section
            # checks if tests got ran this execution
            if row["tests_ran"] == "True":
                #----
                process_tests(grouped_workflows, row, workflow)
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

    #---
    generate_metrics(grouped_workflows, grouped_issuers, wf_fail_rate, wf_PR_triggers_trend, issuer_fail_rate, wf_stddev, wf_fail_duration, wf_tests_passed, wf_test_churn)
    #---
    # setting up structure
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
    }
    return kpis_json

def generate_metrics(grouped_workflows, grouped_issuers, wf_fail_rate,wf_PR_triggers_trend, issuer_fail_rate, wf_stddev, wf_fail_duration, wf_tests_passed, wf_test_churn):
    for wf_name, stats in grouped_workflows.items():
        # removes 10 first executions from total to have accurate values and metrics
        if stats["total"] > 10:
            stats["total"]-=10
        # create line of data for failure rate per wf
        fail_rate = round(stats["fail"] / stats["total"], 2)
        #-- trends failure rate--
        # by month
        rate_month_trend = generate_average_fail_rate_trend(stats["trend_conclusion_timestamps"]["by_month"])
        # by week
        rate_week_trend = generate_average_fail_rate_trend(stats["trend_conclusion_timestamps"]["by_week"])
        #--- trends failure rate end ---
        wf_fail_rate.append(AverageFaillureRatePerWorkflow(workflow_name=wf_name, faillure_rate=fail_rate,execution_number=stats["total"],week_average_trend=rate_week_trend, month_average_trend=rate_month_trend))
        # stddev & mad
        durations = stats["durations"]
        stddev = round(stdev(durations), 2) if len(durations) > 1 else 0.0
        median_durations = statistics.median(durations)
        mad = statistics.median([abs(x - median_durations) for x in durations]) if len(durations)>1 else 0
        # --- trends mad duration ---
        # by month
        monthly_trend = generate_mad_trend(stats["trend_duration_timestamps"]["by_month"])
        # by week
        weekly_trend = generate_mad_trend(stats["trend_duration_timestamps"]["by_week"])
        # -- trends mad duration end ---
        # create line of data for stddev of workdlows
        wf_stddev.append(
            StdDevOfWorkflowExecutions(workflow_name=wf_name, duration_stddev=stddev, duration_mad=mad,week_mad_trend=weekly_trend, month_mad_trend=monthly_trend)
        )
        # ---pull request triggers---
        # by month
        triggers_month_trend = stats["trend_triggers_timestamps"]["by_month"]
        # by week
        triggers_week_trend = stats["trend_triggers_timestamps"]["by_week"] 
        # ---pull request triggers end---
        # create line of data for pull request triggers trend
        wf_PR_triggers_trend.append(PullRequestTriggersTrend( workflow_name=wf_name, week_triggers_trend=triggers_week_trend, month_triggers_trend=triggers_month_trend))

        # average execution time of failling workflow
        # avoid dividing by 0 (0 faillures of the workflow)
        try:
            avr_fail_time = stats["sum_fail_time"] / stats["fail"]
            #mad of failed execution time
            fail_dur = stats["failed_durations"]
            fail_median = statistics.median(fail_dur)
            fail_mad = statistics.median([abs(x - fail_median) for x in fail_dur]) if len(fail_dur)>1 else 0
            # -- trends
            monthly_trend = generate_mad_trend(stats["trend_failed_duration_timestamps"]["by_month"])
            weekly_trend = generate_mad_trend(stats["trend_failed_duration_timestamps"]["by_week"])
            wf_fail_duration.append(AverageFailedWorkflowExecutionTime(workflow_name=wf_name, average_duration=avr_fail_time,fail_mad=fail_mad, week_mad_trend=weekly_trend, month_mad_trend=monthly_trend))
        except ZeroDivisionError:
            wf_fail_duration.append(
                AverageFailedWorkflowExecutionTime(
                    workflow_name=wf_name, average_duration=0.0
                )
            )
        # tests part
        # changed tests--
        avg_changed_tests = stats["sum_test_change"] // stats["total"]
        wf_test_churn.append(
            AverageChangedTestsPerWorkflowExecution(workflow_name=wf_name, average_churn=avg_changed_tests)
        )
        # passed tests
        if stats["total_times_tests_ran_passed"] > 0:
            avg_passed_tests = (stats["sum_test_passed_rate"] / stats["total_times_tests_ran_passed"])
            wf_tests_passed.append(
                AveragePassedTestsPerWorkflowExcecution(workflow_name=wf_name, average_success_rate=avg_passed_tests)
            )
    for iss_name, stats in grouped_issuers.items():
        iss_fail_rate = round(stats["fail"] / stats["total"], 2)
        issuer_fail_rate.append(
            AverageFaillureRatePerIssuer(
                issuer_name=iss_name, faillure_rate=iss_fail_rate,execution_number=stats["total"]
            )
        )


def generate_average_fail_rate_trend(timestamps):
    rate_trend = {}
    # print("timestamps")
    # print(timestamps)
    for time, count in timestamps.items():
        # print("count")
        # print(count)
        total = count.get("total",0)
        fail = count.get("fail",0)
        if total == 0:
            rate_trend[time] = 0.0
            continue
        rate_trend[time] = round(float(fail/total), 2)
    return rate_trend


def generate_mad_trend(timestamps):
    mad_trend = {}
    for time, durations in timestamps.items():
        if not durations:
            mad_trend[time] = 0.0
            continue
        median_duration = statistics.median(durations)
        deviations = [abs(dur - median_duration) for dur in durations]
        mad_duration = statistics.median(deviations)
        mad_trend[time] = round(mad_duration, 2)
    return mad_trend

def process_tests(grouped_workflows, row, workflow):
    # increment number of times the tests got ran in workflow execution
    grouped_workflows[workflow]["total_times_tests_ran"] += 1
    # prevent edge case of dividing by 0
    if (int(row["tests_total"]) - int(row["tests_skipped"])) > 0:
        grouped_workflows[workflow]["total_times_tests_ran_passed"] += 1
        # passed tests rate
        pass_rate = (float(row["tests_passed"])) / (
            float(row["tests_total"]) - float(row["tests_skipped"])
        )
        grouped_workflows[workflow]["sum_test_passed_rate"] += pass_rate

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
    # format:(2025, 29, 1)
    iso_year, iso_week, _ = dt.isocalendar()
    # format: "2025-W29"
    return f"{iso_year}-W{iso_week:02d}"

def get_month(timestamp):
    dt = datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%SZ")
    # format "2025-07"
    return dt.strftime("%Y-%m")

# main function
def compute(csv_path_read:str,json_path_write:str):
    raw_data_path = csv_path_read
    kpis_path = json_path_write
    #----
    # uncomment to test trend values
    # parse_raw_data(raw_data_path, raw_dict)
    # test_mad_trends(raw_dict)
    #----
    try:
        # parse csv data
        parse_raw_data(raw_data_path, raw_dict)
        # compute and transform that csv data into kpis
        kpis_dict = compute_kpis(raw_dict)
        # writes computed data in json file
        write_json(kpis_path,kpis_dict)
        # return kpis dict to send it to front end
        return kpis_dict
    except Exception as e:
        print("[KPI transformer] error: ", e)
        traceback.print_exc()


# ----test functions---- #
# uncomment this function in the "compute" function and comment the try catch statement
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

        # Check if this execution ends after the previous one started
        last_created = last_created_at_per_workflow.get(workflow)
        if last_created and updated_at > last_created:
            continue

        # Record the current created_at as the last seen one
        last_created_at_per_workflow[workflow] = created_at

        month_key = get_month(created_at_str)
        workflow_executions[workflow].append((month_key, duration))

    workflow_mad_by_month: dict[str, dict[str, float]] = {}

    for workflow, entries in workflow_executions.items():
        if len(entries) > 10:
            # skip the 10 first executions
            entries = entries[10:]
            monthly_values = DefaultDict(list)
            for month_key, duration in entries:
                monthly_values[month_key].append(duration)

            mad_by_month = {}
            for month, values in monthly_values.items():
                # uncomment to see each duration for each timestamp
                # print(f"[DEBUG] Workflow: {workflow}, Month: {month}, Values: {values}")
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
            # skip the 10 first lines
            entries = entries[10:]
            weekly_values = DefaultDict(list)
            for week_key, duration in entries:
                weekly_values[week_key].append(duration)

            mad_by_week = {}
            for week, values in weekly_values.items():
                # uncomment to see each duration for each timestamp
                # print(f"[DEBUG] Workflow: {workflow}, Week: {week}, Values: {values}")
                med = median(values)
                deviations = [abs(x - med) for x in values]
                mad_val = median(deviations) if deviations else 0.0
                mad_by_week[week] = round(mad_val, 2)

            workflow_mad_by_week[workflow] = mad_by_week

    return workflow_mad_by_week
#--- test function END ----

if __name__ == "__main__":
    print("transform executed from terminal!!!!")
