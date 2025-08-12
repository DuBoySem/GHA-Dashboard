// Tous les "count" doivent être "total"
export const KPIs = {
    "AverageFaillureRatePerWorkflow": [
        {
            "workflow_name": "Create wheel",
            "faillure_rate": 0.33,
            "execution_number": 3,
            "week_average_trend": {
                "2024-W24": {
                    "rate": 0.0,
                    "total": 0
                },
                "2024-W25": {
                    "rate": 0.0,
                    "total": 1
                }
            },
            "month_average_trend": {
                "2024-06": {
                    "rate": 0.0,
                    "total": 1
                },
                "2024-07": {
                    "rate": 1.0,
                    "total": 1
                }
            }
        },
        {
            "workflow_name": "Run tests on a pr",
            "faillure_rate": 0.4,
            "execution_number": 271,
            "week_average_trend": {
                "2024-W42": {
                    "rate": 0.0,
                    "total": 0
                },
                "2024-W43": {
                    "rate": 0.67,
                    "total": 3
                }
            },
            "month_average_trend": {
                "2024-06": {
                    "rate": 0.0,
                    "total": 6
                },
                "2024-07": {
                    "rate": 0.25,
                    "total": 4
                }
            }
        },
        {
            "workflow_name": "Run tests",
            "faillure_rate": 0.19,
            "execution_number": 301,
            "week_average_trend": {
                "2024-W24": {
                    "rate": 0.0,
                    "total": 0
                },
                "2024-W25": {
                    "rate": 0.0,
                    "total": 3
                }
            },
            "month_average_trend": {
                "2024-06": {
                    "rate": 0.0,
                    "total": 9
                },
                "2024-07": {
                    "rate": 0.16,
                    "total": 19
                }
            }
        }
    ],
    "StdDevWorkflowExecutions": [
        {
            "workflow_name": "Create wheel",
            "duration_stddev": 2114.41,
            "duration_mad": 257.0,
            "week_mad_trend": {
                "2024-W24": {
                    "mad": 0.0,
                    "total": 0
                },
                "2024-W25": {
                    "mad": 0.0,
                    "total": 1
                }
            },
            "month_mad_trend": {
                "2024-06": {
                    "mad": 0.0,
                    "total": 1
                },
                "2024-07": {
                    "mad": 0.0,
                    "total": 1
                }
            }
        },
        {
            "workflow_name": "Run tests on a pr",
            "duration_stddev": 28599.82,
            "duration_mad": 107.0,
            "week_mad_trend": {
                "2024-W24": {
                    "mad": 13.0,
                    "total": 3
                },
                "2024-W25": {
                    "mad": 71212.0,
                    "total": 2
                }
            },
            "month_mad_trend": {
                "2024-06": {
                    "mad": 183.0,
                    "total": 6
                },
                "2024-07": {
                    "mad": 153.5,
                    "total": 4
                }
            }
        },
        {
            "workflow_name": "Run tests",
            "duration_stddev": 3460.28,
            "duration_mad": 1411.0,
            "week_mad_trend": {
                "2024-W24": {
                    "mad": 0.0,
                    "total": 0
                },
                "2024-W25": {
                    "mad": 83.0,
                    "total": 3
                }
            },
            "month_mad_trend": {
                "2024-06": {
                    "mad": 2392.0,
                    "total": 9
                },
                "2024-07": {
                    "mad": 789.0,
                    "total": 19
                }
            }
        }
    ],
    "AverageFaillureRatePerIssuer": [
        {
            "issuer_name": "sqla-tester",
            "faillure_rate": 0.33,
            "execution_number": 3
        },
        {
            "issuer_name": "roli2py",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "suraj-ora-2020",
            "faillure_rate": 0.62,
            "execution_number": 8
        },
        {
            "issuer_name": "dlax",
            "faillure_rate": 0.22,
            "execution_number": 60
        },
        {
            "issuer_name": "galloviolet",
            "faillure_rate": 0.0,
            "execution_number": 2
        },
        {
            "issuer_name": "CaselIT",
            "faillure_rate": 0.18,
            "execution_number": 17
        },
        {
            "issuer_name": "jiajunsu",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "Polandia94",
            "faillure_rate": 0.6,
            "execution_number": 47
        },
        {
            "issuer_name": "krave1986",
            "faillure_rate": 0.0,
            "execution_number": 3
        },
        {
            "issuer_name": "aradkdj",
            "faillure_rate": 0.67,
            "execution_number": 3
        },
        {
            "issuer_name": "IamGroooooot",
            "faillure_rate": 1.0,
            "execution_number": 1
        },
        {
            "issuer_name": "phy1729",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "slahn",
            "faillure_rate": 1.0,
            "execution_number": 2
        },
        {
            "issuer_name": "ovangle",
            "faillure_rate": 0.5,
            "execution_number": 2
        },
        {
            "issuer_name": "ashm-dev",
            "faillure_rate": 0.38,
            "execution_number": 13
        },
        {
            "issuer_name": "jkrejcha",
            "faillure_rate": 1.0,
            "execution_number": 1
        },
        {
            "issuer_name": "SaidBySolo",
            "faillure_rate": 0.5,
            "execution_number": 2
        },
        {
            "issuer_name": "methane",
            "faillure_rate": 0.82,
            "execution_number": 11
        },
        {
            "issuer_name": "cjw296",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "stefmolin",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "Kaan191",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "jvllmr",
            "faillure_rate": 0.67,
            "execution_number": 3
        },
        {
            "issuer_name": "KarolGongolaCledar",
            "faillure_rate": 1.0,
            "execution_number": 3
        },
        {
            "issuer_name": "david-fed",
            "faillure_rate": 0.5,
            "execution_number": 2
        },
        {
            "issuer_name": "PookieBuns",
            "faillure_rate": 0.0,
            "execution_number": 2
        },
        {
            "issuer_name": "AugPro",
            "faillure_rate": 0.0,
            "execution_number": 2
        },
        {
            "issuer_name": "mmingyu",
            "faillure_rate": 0.4,
            "execution_number": 5
        },
        {
            "issuer_name": "martinburchell",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "nphilipp",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "AndrewJackson2020",
            "faillure_rate": 1.0,
            "execution_number": 1
        },
        {
            "issuer_name": "lelit",
            "faillure_rate": 1.0,
            "execution_number": 2
        },
        {
            "issuer_name": "FeeeeK",
            "faillure_rate": 0.5,
            "execution_number": 2
        },
        {
            "issuer_name": "NickWilkinson37",
            "faillure_rate": 1.0,
            "execution_number": 1
        },
        {
            "issuer_name": "dependabot[bot]",
            "faillure_rate": 0.0,
            "execution_number": 10
        },
        {
            "issuer_name": "mjpieters",
            "faillure_rate": 0.33,
            "execution_number": 3
        },
        {
            "issuer_name": "gmcrocetti",
            "faillure_rate": 0.0,
            "execution_number": 3
        },
        {
            "issuer_name": "jraby",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "RazerM",
            "faillure_rate": 0.5,
            "execution_number": 10
        },
        {
            "issuer_name": "cjbj",
            "faillure_rate": 0.58,
            "execution_number": 12
        },
        {
            "issuer_name": "alphavector",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "gordthompson",
            "faillure_rate": 0.0,
            "execution_number": 2
        },
        {
            "issuer_name": "Ineffable22",
            "faillure_rate": 0.67,
            "execution_number": 3
        },
        {
            "issuer_name": "hugovk",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "huuyafwww",
            "faillure_rate": 0.5,
            "execution_number": 2
        },
        {
            "issuer_name": "sh-at-cs",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "tlocke",
            "faillure_rate": 0.0,
            "execution_number": 2
        },
        {
            "issuer_name": "kkirsche",
            "faillure_rate": 1.0,
            "execution_number": 3
        },
        {
            "issuer_name": "bsipocz",
            "faillure_rate": 0.33,
            "execution_number": 3
        },
        {
            "issuer_name": "tapetersen",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "harupy",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "jaudebert",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "volcan01010",
            "faillure_rate": 0.5,
            "execution_number": 2
        },
        {
            "issuer_name": "edgarrmondragon",
            "faillure_rate": 0.0,
            "execution_number": 3
        },
        {
            "issuer_name": "jvanasco",
            "faillure_rate": 1.0,
            "execution_number": 3
        },
        {
            "issuer_name": "jeffh92",
            "faillure_rate": 0.67,
            "execution_number": 3
        },
        {
            "issuer_name": "Masterchen09",
            "faillure_rate": 0.0,
            "execution_number": 2
        },
        {
            "issuer_name": "andersbogsnes",
            "faillure_rate": 1.0,
            "execution_number": 1
        },
        {
            "issuer_name": "opkna",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "zeehio",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "lonkeknol",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "dhirving",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "amotl",
            "faillure_rate": 0.0,
            "execution_number": 1
        },
        {
            "issuer_name": "sqlalchemy-bot",
            "faillure_rate": 0.19,
            "execution_number": 290
        }
    ],
    "PullRequestTriggersTrend": [ // À adpater selon la nouvelle structure ex: 2024-06: {median: x, total: y}
        {
            "workflow_name": "Create wheel",
            "week_triggers_trend": {
                "2024-W24": 0,
                "2024-W25": 0
            },
            "month_triggers_trend": {
                "2024-06": {
                    "median": 3,
                    "total": 5
                },
                "2024-07": {
                    "median": 8,
                    "total": 2
                }
            }
        },
        {
            "workflow_name": "Run tests on a pr",
            "week_triggers_trend": {
                "2024-W24": 3,
                "2024-W25": 2
            },
            "month_triggers_trend": {
                "2024-06": {
                    "median": 3,
                    "total": 6
                },
                "2024-07": {
                    "median": 4,
                    "total": 4
                }
            }
        },
        {
            "workflow_name": "Run tests",
            "week_triggers_trend": {
                "2024-W24": 0,
                "2024-W25": 0
            },
            "month_triggers_trend": {
               "2024-06": {
                    "median": 13,
                    "total": 5
                },
                "2024-07": {
                    "median": 5,
                    "total": 2
                }
            }
        }
    ],
    "AveragePassedTestsPerWorkflowExcecution": [],
    "AverageChangedTestsPerWorkflowExecution": [
        {
            "workflow_name": "Create wheel",
            "average_churn": 1031.0
        },
        {
            "workflow_name": "Run tests on a pr",
            "average_churn": 168.0
        },
        {
            "workflow_name": "Run tests",
            "average_churn": 66.0
        }
    ],
    "AverageFailedWorkflowExecutionTime": [
        {
            "workflow_name": "Create wheel",
            "median_duration": 0.0,
            "total_fails": 1,
            "week_median_trend": {
                "2024-W31": {
                    "median": 5465.0,
                    "total": 1
                },
                "2024-W32": {
                    "median": 0.0,
                    "total": 0
                }
            },
            "month_median_trend": {
                "2024-07": {
                    "median": 5465.0,
                    "total": 1
                },
                "2024-08": {
                    "median": 0.0,
                    "total": 0
                }
            }
        },
        {
            "workflow_name": "Run tests on a pr",
            "median_duration": 341.5,
            "total_fails": 108,
            "week_median_trend": {
                "2024-W28": {
                    "median": 332.0,
                    "total": 1
                },
                "2024-W29": {
                    "median": 0.0,
                    "total": 0
                }
            },
            "month_median_trend": {
                "2024-07": {
                    "median": 332.0,
                    "total": 1
                },
                "2024-08": {
                    "median": 6378.5,
                    "total": 6 
                }
            }
        },
        {
            "workflow_name": "Run tests",
            "median_duration": 4365.5,
            "total_fails": 58,
            "week_median_trend": {
                "2024-W28": {
                    "median": 0.0,
                    "total": 0
                },
                "2024-W29": {
                    "median": 3245.0,
                    "total": 1
                }
            },
            "month_median_trend": {
                "2024-07": {
                    "median": 3245.0,
                    "total": 3
                },
                "2024-08": {
                    "median": 8693.5,
                    "total": 2
                }
            }
        }
    ],
    "MedianChurnPerWorkflow": [
        {
            "workflow_name": "Create wheel",
            "median_value": 0,
            "week_med_trend": {
                "2024-W32": {   
                    "median": 2595.0,
                    "total": 1
                },
                "2024-W31": {
                    "median": 4386.0,
                    "total": 1
                }
            },
            "month_med_trend": {
                "2024-08": {
                    "median": 2595.0,
                    "total": 1
                },
                "2024-07": {
                    "median": 4386.0,
                    "total": 1
                }
            }
        },
        {
            "workflow_name": "Run tests on a pr",
            "median_value": 0, // Median à zéro alors que dans month_med_trend on a des valeurs pour median
            "week_med_trend": {
                "2025-W28": {
                    "median": 2.0,
                    "total": 1
                },
                "2025-W27": {
                    "median": 457.0,
                    "total": 4
                }
            },
            "month_med_trend": {
                "2025-07": {
                    "median": 189.0,
                    "total": 5
                },
                "2025-06": {
                    "median": 311.0,
                    "total": 19
                }
            }
        },
        {
            "workflow_name": "Run tests",
            "median_value": 0,
            "week_med_trend": {
                "2025-W27": {
                    "median": 371.5,
                    "total": 4
                },
                "2025-W26": {
                    "median": 94.0,
                    "total": 7
                }
            },
            "month_med_trend": {
                "2025-07": {
                    "median": 371.5,
                    "total": 4
                },
                "2025-06": {
                    "median": 20.5,
                    "total": 30
                }
            }
        }
    ],
    "MedianDurationPerWorkflowExecution": [
        {
            "workflow_name": "Create wheel",
            "execution_number": 3,
            "duration_median": 8992.0,
            "week_median_trend": {
                "2024-W24": {
                    "median": 0.0,
                    "total": 0
                },
                "2024-W25": {
                    "median": 8992.0,
                    "total": 1
                }
            },
            "month_median_trend": {
                "2024-06": {
                    "median": 8992.0,
                    "total": 1
                },
                "2024-07": {
                    "median": 5465.0,
                    "total": 1
                }
            }
        },
        {
            "workflow_name": "Run tests on a pr",
            "execution_number": 271,
            "duration_median": 340.0,
            "week_median_trend": {
                "2024-W24": {
                    "median": 375.0,
                    "total": 3
                },
                "2024-W25": {
                    "median": 71575.0,
                    "total": 2
                }
            },
            "month_median_trend": {
                "2024-06": {
                    "median": 545.5,
                    "total": 6
                },
                "2024-07": {
                    "median": 500.0,
                    "total": 4
                }
            }
        },
        {
            "workflow_name": "Run tests",
            "execution_number": 301,
            "duration_median": 4091.0,
            "week_median_trend": {
                "2024-W24": {
                    "median": 0.0,
                    "total": 0
                },
                "2024-W25": {
                    "median": 5345.0,
                    "total": 3
                }
            },
            "month_median_trend": {
                "2024-06": {
                    "median": 5345.0,
                    "total": 9
                },
                "2024-07": {
                    "median": 5251.0,
                    "total": 19
                }
            }
        }
    ],
    "MedianPassedTestsratePerWorkflow": [
        {
            "workflow_name": "Create wheel",
            "execution_number": 0,
            "median_success_rate": 0.0,
            "median_passed_value": 0,
            "median_test_value": 0,
            "week_median_trend": {},
            "month_median_trend": {}
        },
        {
            "workflow_name": "Run tests on a pr",
            "execution_number": 58,
            "median_success_rate": 1.0,
            "median_passed_value": 44784,
            "median_test_value": 44784,
            "week_median_trend": {
                "2025-W28": {
                    "rate": 0.0, 
                    "passed_count": 0,
                    "total": 0
                },
                "2025-W27": {
                    "rate": 1.0,
                    "passed_count": 45508,
                    "total": 45508
                }
            },
            "month_median_trend": {
                "2025-07": {
                    "rate": 1.0, // On est dans median mais ça calcule le rate
                    "passed_count": 45508,
                    "total": 45508 // "total" au lieu de "total_passed"
                },
                "2025-06": {
                    "rate": 1.0,
                    "passed_count": 45222,
                    "total": 45222
                }
            }
        },
        {
            "workflow_name": "Run tests",
            "execution_number": 62,
            "median_success_rate": 0.9999678116660581,
            "median_passed_value": 1491114,
            "median_test_value": 1491162,
            "week_median_trend": {
                "2025-W27": {
                    "rate": 0.9999678864752997,
                    "passed_count": 1492229,
                    "total": 1492277 
                },
                "2025-W26": {
                    "rate": 0.9999677917846237,
                    "passed_count": 1490255,
                    "total": 1490303
                }
            },
            "month_median_trend": {
                "2025-07": {
                    "rate": 0.9999678864752997,
                    "passed_count": 1492229,
                    "total": 1492277
                },
                "2025-06": {
                    "rate": 0.9999677837213828,
                    "passed_count": 1489882,
                    "total": 1489930
                }
            }
        }
    ]
}
