import pytest
from unittest.mock import MagicMock, patch, mock_open
from datetime import datetime, timedelta
import json
import backend.gha_runner as gha_runner


def test_clone_or_update_ghaminer_existing_repo():
    with patch("backend.gha_runner.subprocess.run") as mock_run, \
            patch("backend.gha_runner.shutil.rmtree") as mock_rmtree, \
            patch("backend.gha_runner.patch_gha") as mock_patch, \
            patch("backend.gha_runner.GHAMINER_PATH") as mock_ghaminer_path, \
            patch("backend.gha_runner.GHAMETRICS_PATH") as mock_metrics_path:

        mock_ghaminer_path.exists.return_value = True
        mock_metrics_path.exists.return_value = True

        gha_runner.clone_or_update_ghaminer()

        mock_run.assert_called_once_with(["git","-C", str(mock_ghaminer_path), "pull"],check=True)
        mock_rmtree.assert_not_called()
        mock_patch.assert_not_called()


def test_clone_or_update_ghaminer_error_in_repo():
    with patch("backend.gha_runner.subprocess.run") as mock_run, \
            patch("backend.gha_runner.shutil.rmtree") as mock_rmtree, \
            patch("backend.gha_runner.patch_gha") as mock_patch, \
            patch("backend.gha_runner.GHAMINER_PATH") as mock_ghaminer_path, \
            patch("backend.gha_runner.GHAMETRICS_PATH") as mock_metrics_path:

        mock_ghaminer_path.exists.return_value = True
        mock_metrics_path.exists.return_value = False

        gha_runner.clone_or_update_ghaminer()

        mock_rmtree.assert_called_once_with(mock_ghaminer_path)

        mock_run.assert_called_once_with(["git", "clone", "https://github.com/stilab-ets/GHAminer.git", str(mock_ghaminer_path)],
                                         check=True,
                                         stdout = gha_runner.subprocess.DEVNULL,
                                         stderr = gha_runner.subprocess.STDOUT
                                        )
        mock_patch.assert_called_once()



def test_clone_or_update_ghaminer_no_repo():
    with patch("backend.gha_runner.subprocess.run") as mock_run, \
            patch("backend.gha_runner.shutil.rmtree") as mock_rmtree, \
            patch("backend.gha_runner.patch_gha") as mock_patch, \
            patch("backend.gha_runner.GHAMINER_PATH") as mock_ghaminer_path, \
            patch("backend.gha_runner.GHAMETRICS_PATH") as mock_metrics_path:

        mock_ghaminer_path.exists.return_value = False
        mock_metrics_path.exists.return_value = False

        gha_runner.clone_or_update_ghaminer()

        mock_rmtree.assert_not_called()

        mock_run.assert_any_call(["git", "clone", "https://github.com/stilab-ets/GHAminer.git", str(mock_ghaminer_path)],
                                    check=True,
                                    stdout = gha_runner.subprocess.DEVNULL,
                                    stderr = gha_runner.subprocess.STDOUT
                                )
        mock_patch.assert_called_once()


def test_should_run_no_file_true():
    with patch("backend.gha_runner.STATE_FILE") as state_file:
        state_file.exists.return_value = False

        result = gha_runner.should_run()
        assert result == True


def test_should_run_long_time_true():
    mock_time = "2000-01-01T00:00:00"
    mock_json = json.dumps({"last_run": mock_time})
    
    with patch("backend.gha_runner.STATE_FILE") as state_file, \
         patch("builtins.open",mock_open(read_data=mock_json)):

        state_file.exists.return_value = True

        result = gha_runner.should_run()
        assert result == True


def test_should_run_false():
    mock_time = datetime.utcnow() - timedelta(minutes=3)
    mock_json = json.dumps({"last_run": mock_time.isoformat()})
    
    with patch("backend.gha_runner.STATE_FILE") as state_file, \
         patch("builtins.open",mock_open(read_data=mock_json)):

        state_file.exists.return_value = True

        result = gha_runner.should_run()
        assert result == False


def test_run_ghaminer_if_needed_false():
    mock_repo_url = "a"
    mock_token = "a"
    with patch("backend.gha_runner.should_run") as mock_should_run,\
        patch("backend.gha_runner.run_gha_async") as mock_run_gha_async:

        mock_should_run.return_value = False
        gha_runner.run_ghaminer_if_needed(mock_repo_url,mock_token)
        mock_run_gha_async.assert_not_called()


def test_run_ghaminer_if_needed_no_gha_path_false():
    mock_repo_url = "a"
    mock_token = "a"
    with patch("backend.gha_runner.should_run") as mock_should_run,\
         patch("backend.gha_runner.clone_or_update_ghaminer") as mock_clone_or_update_gha, \
         patch("backend.gha_runner.GHAMETRICS_PATH") as mock_GHA_PATH, \
         patch("backend.gha_runner.run_gha_async") as mock_run_gha_async, \
         patch("backend.gha_runner.STATE_FILE") as mock_STATE_FILE:

        mock_should_run.return_value = True
        mock_GHA_PATH.exists.return_value = False
        with pytest.raises(FileNotFoundError):
            gha_runner.run_ghaminer_if_needed(mock_repo_url, mock_token)
        mock_run_gha_async.assert_not_called()


def test_run_ghaminer_if_needed_true():
    mock_repo_url = "a"
    mock_token = "a"
    with patch("backend.gha_runner.should_run") as mock_should_run,\
         patch("backend.gha_runner.clone_or_update_ghaminer") as mock_clone_or_update_gha, \
         patch("backend.gha_runner.GHAMETRICS_PATH") as mock_GHA_PATH, \
         patch("backend.gha_runner.run_gha_async") as mock_run_gha_async, \
         patch("backend.gha_runner.STATE_FILE") as mock_STATE_FILE:

        mock_should_run.return_value = True
        mock_GHA_PATH.exists.return_value = True
        gha_runner.run_ghaminer_if_needed(mock_repo_url,mock_token)
        mock_clone_or_update_gha.assert_called_once()
        mock_run_gha_async.assert_called_once()


def test_run_gha_async():
    mock_repo_url = "a"
    mock_token = "a"
    with patch("backend.gha_runner.subprocess.Popen") as mock_popen, \
        patch("backend.gha_runner.threading.Thread") as mock_thread_func:

        mock_process = MagicMock()
        mock_popen.return_value = mock_process

        mock_thread = MagicMock()
        mock_thread_func.return_value = mock_thread
        
        gha_runner.run_gha_async(mock_repo_url, mock_token)

        mock_popen.assert_called_once()
        process_args = mock_popen.call_args[0][0]

        assert mock_repo_url in process_args
        assert mock_token in process_args
        assert str(gha_runner.GHAMETRICS_PATH) in process_args

        # mock_thread.assert_called_once_with(
        #     target=gha_runner.gha_monitor,
        #     args=(mock_process,)
        # )
        #
        # mock_thread_instance.start.assert_called_once()
