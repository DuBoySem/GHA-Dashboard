import traceback
import csv
import json
import os
from dataclasses import asdict, dataclass
from statistics import stdev
from typing import DefaultDict, dataclass_transform

# setup the base folder path
root_path = os.path.dirname(os.path.abspath(__file__))
# paths to the files
raw_data_path = ""
kpis_path = ""
# raw data container
raw_dict = []

# KPIs strures
# TODO possible restucturaton of data to optimize process time
# genral
# by workflow


@dataclass
class StdDevOfWorkflowExecutions:
    workflow_name: str
    duration_stddev: float


@dataclass
class AverageFaillureRatePerIssuer:
    issuer_name: str
    faillure_rate: float


@dataclass
class AverageFaillureRatePerWorkflow:
    workflow_name: str
    faillure_rate: float


@dataclass
class AverageFailedWorkflowExecutionTime:
    workflow_name: str
    average_duration: float


@dataclass
class AverageChangedTestsPerWorkflowExecution:
    workflow_name: str
    average_churn: float


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
            "durations": [],
            "sum_fail_time": 0,
            "total_times_tests_ran": 0,
            "total_times_tests_ran_passed": 0,
            "sum_test_change": 0.0,
            "sum_test_passed_rate": 0.0,
        }
    )
    grouped_issuers = DefaultDict(lambda: {"fail": 0, "total": 0})

    # iterate over the raw data
    for row in raw_dict:
        # for workflows
        # get the workflow name
        workflow = row.get("workflow_name")
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
            # test section
            # checks if tests got ran this execution
            if row["tests_ran"] == "True":
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
                # prevent edge case of dividing by 0
            # test churn
            if row["gh_test_churn"]:
                grouped_workflows[workflow]["sum_test_change"] += int(row["gh_test_churn"])

            # for issuers
            # get issuer name
            issuer_name = row.get("issuer_name")

            # increment number of build executed by issuer
            grouped_issuers[issuer_name]["total"] += 1

            # checks if excution was a failure to increment it
            if conclusion == "failure":
                # increment number of failed times for the workflow
                grouped_workflows[workflow]["fail"] += 1
                # adds duration of the failed execution
                grouped_workflows[workflow]["sum_fail_time"] += duration
                # increment number of failed times for the issuer
                grouped_issuers[issuer_name]["fail"] += 1
            #---------------
    wf_fail_rate = []
    issuer_fail_rate = []
    wf_stddev = []
    wf_fail_duration = []
    wf_tests_passed = []
    wf_test_churn = []

    for wf_name, stats in grouped_workflows.items():
        # removes 10 first executions from total to have accurate values and metrics
        if stats["total"] > 10:
            stats["total"]-=10
        # create line of data for failure rate per wf
        fail_rate = round(stats["fail"] / stats["total"], 2)
        wf_fail_rate.append(AverageFaillureRatePerWorkflow(workflow_name=wf_name, faillure_rate=fail_rate))
        # stddev
        durations = stats["durations"]
        stddev = round(stdev(durations), 2) if len(durations) > 1 else 0.0
        # create line of data for stddev of workdlows
        wf_stddev.append(
            StdDevOfWorkflowExecutions(workflow_name=wf_name, duration_stddev=stddev)
        )
        # average execution time of failling workflow
        # avoid dividing by 0 (0 faillures of the workflow)
        try:
            avr_fail_time = stats["sum_fail_time"] / stats["fail"]
            wf_fail_duration.append(AverageFailedWorkflowExecutionTime(workflow_name=wf_name, average_duration=avr_fail_time))
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
                issuer_name=iss_name, faillure_rate=iss_fail_rate
            )
        )

    # setting up structure
    kpis_json = {
        "AverageFaillureRatePerWorkflow": [asdict(ele) for ele in wf_fail_rate],
        "StdDevWorkflowExecutions": [asdict(ele) for ele in wf_stddev],
        "AverageFaillureRatePerIssuer": [asdict(ele) for ele in issuer_fail_rate],
        "AveragePassedTestsPerWorkflowExcecution": [
            asdict(ele) for ele in wf_tests_passed
        ],
        "AverageChangedTestsPerWorkflowExecution": [
            asdict(ele) for ele in wf_test_churn
        ],
        "AverageFailedWorkflowExecutionTime": [asdict(ele) for ele in wf_fail_duration],
    }
    return kpis_json


# main function
def compute(csv_path_read:str,json_path_write:str):
    raw_data_path = csv_path_read
    kpis_path = json_path_write
    
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


if __name__ == "__main__":
    print("transform executed by terminal!!!!")
