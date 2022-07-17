import { useEffect, useState } from "react";

function App() {
  const [files, setFiles] = useState([]);
  const [isEmailFilter, setIsEmailFilter] = useState(false);
  const [isPhoneFilter, setIsPhoneFilter] = useState(false);
  const [isFormDisabled, setIsFormDisabled] = useState(true);

  // submit button disables
  useEffect(() => {
    if (!!files && (isEmailFilter || isPhoneFilter)) {
      setIsFormDisabled(false);
    } else {
      setIsFormDisabled(true);
    }
  }, [files, isEmailFilter, isPhoneFilter]);

  // takes file as a string and converts to array of arrays
  const convertFileToMatrix = (fileString) => {
    let arr = fileString.split("\n");
    return arr.map((rowString) => rowString.split(","));
  };

  // logic for filtering out duplicate rows
  const removeDupes = (fileArray) => {
    const dict = {
      emails: {},
      phones: {},
    };
    return fileArray.filter((rowArr) => {
      let keepRow = true;
      let emailEntry = rowArr[2];
      let phoneEntry = rowArr[3];
      if (isEmailFilter && emailEntry !== "" && emailEntry in dict.emails) {
        keepRow = false;
      }
      if (isPhoneFilter && phoneEntry !== "" && phoneEntry in dict.phones) {
        keepRow = false;
      }
      if (keepRow) {
        if (isEmailFilter) dict.emails[emailEntry] = true;
        if (isPhoneFilter) dict.phones[phoneEntry] = true;
      }
      return keepRow;
    });
  };

  // converts fileMatrix to CSV file for output
  const convertToCsv = (filteredFile) => {
    let newCsvFile = "data:text/csv;charset=utf-8,";
    newCsvFile += filteredFile.map((row) => row.join(",")).join("\n");
    return encodeURI(newCsvFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileAsString = await files[0].text();

    const fileAsMatrix = convertFileToMatrix(fileAsString);
    const filteredFile = removeDupes(fileAsMatrix);
    const newFileAsCsv = convertToCsv(filteredFile);
    window.open(newFileAsCsv);
    alert("File successfully filtered!");
  };

  const handleFile = (e) => {
    setFiles(e.target.files);
  };

  const handleEmailFilter = (e) => {
    setIsEmailFilter(!isEmailFilter);
  };

  const handlePhoneFilter = (e) => {
    setIsPhoneFilter(!isPhoneFilter);
  };

  return (
    <div className="App flex justify-center items-center h-screen sky-bg">
      <header className="App-header max-w-screen-md">
        <img
          src="images/kevalalogo.png"
          alt="kevalalogo"
          className="h-20 mb-10 mx-auto grow hover:grow"
        />
        <h1 className="mt-1 text-4xl font-extrabold  sm:text-5xl sm:tracking-tight lg:text-6xl m-8 text-center text-slate-800">
          Upload CSV to remove duplicates.
        </h1>
        <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:px-10 clay">
            <form
              data-testid="form-input"
              className="space-y-7 p-2"
              onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700"
                ></label>
                <div className="mt-1">
                  <input
                    className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-sky-50 file:text-[#3898EC]
                    hover:file:bg-sky-100 "
                    data-testid="file-input"
                    type="file"
                    name="file"
                    accept=".csv"
                    required
                    files={files}
                    onChange={handleFile}
                  />
                </div>
              </div>
              <p>Choose filtering method(s) below:</p>

              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    className="focus:ring-[#3898EC] h-4 w-4 border-gray-300 rounded-full"
                    data-testid="email-input"
                    name="email"
                    type="checkbox"
                    checked={isEmailFilter}
                    onChange={handleEmailFilter}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="email" className="font-medium text-gray-700">
                    Email
                  </label>
                  <p id="email-description" className="text-gray-500">
                    Filter out rows with duplicate emails
                  </p>
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    className="focus:ring-[#3898EC] h-4 w-4  border-gray-300 rounded-full"
                    data-testid="phone-input"
                    name="phone"
                    type="checkbox"
                    checked={isPhoneFilter}
                    onChange={handlePhoneFilter}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="phone" className="font-medium text-gray-700">
                    Phone
                  </label>
                  <p id="phone-description" className="text-gray-500">
                    Filter out rows with duplicate phone numbers
                  </p>
                </div>
              </div>

              <input
                className="inline-flex items-center mx-[210px] px-10 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#3898EC] hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                type="submit"
                value="Submit"
                disabled={isFormDisabled}
                data-testid="submit-button"
              />
            </form>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
