import backend.csv_checker as csv_checker
import pytest
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock


def test_get_line_number_valid_file():
    result = csv_checker.get_line_number()
    assert isinstance(result,int)

def test_get_line_number_file_error():
    csv_checker.csv_path_read = ""
    result = csv_checker.get_line_number()
    assert result == 0

@pytest.mark.asyncio
async def test_check_csv():
    mock_request = MagicMock()
    mock_request.is_disconnected = AsyncMock(side_effect=[False,True])

    #patch dependencies
    with patch("backend.csv_checker.os.path.exists", return_value=True), \
         patch("backend.csv_checker.get_line_number", side_effect=[5, 5]), \
         patch("backend.csv_checker.compute", return_value={"result": 42}), \
         patch("backend.csv_checker.csv_path_read", "fake.csv"), \
         patch("backend.csv_checker.json_path_write", "fake.json"), \
         patch("backend.csv_checker.asyncio.sleep", new_callable=AsyncMock):

        buffer = csv_checker.check_csv(mock_request)
        result = await buffer.__anext__()
        assert result == 'data:{"result": 42}\n\n'
