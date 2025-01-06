import submitAnimation from '/default/ring-loading.gif';
import PageComponent from "../../components/PageComponent";
import { useEffect, useRef, useState } from 'react';
import axiosClient from '../../axios';
import loading_table from "/default/ring-loading.gif";
import { useReactToPrint } from 'react-to-print';

export default function Logs() {
  const today = new Date().toISOString().split('T')[0];

  const [submitLoading, setSubmitLoading] = useState(false);
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [getLogs, showGetLogs] = useState([]);
  const [logsFunction, getLogsFunctions] = useState(false);
  const [loadingLogs, getLoadingLogs] = useState(true);
  const [submitButton, setSubmitButton] = useState(true);

  // For the ToDate Input
  const handleToDateChange = (ev) => {
    const selectedDate = ev.target.value;

    if (new Date(selectedDate) < new Date(fromDate)) {
      setSubmitButton(false);
    }
    else{
      setSubmitButton(true);
    }

    setToDate(selectedDate);
  };

  // Get Logs
  function getLogsInfo(e){
    e.preventDefault();

    getLogsFunctions(true);
    getLoadingLogs(true);

    const Showlogs = {
      startDate: fromDate,
      endDate: toDate,
    };

    axiosClient
    .post('/showlogs', Showlogs)
    .then((response) => {
      const responseData = response.data;

      const LogsData = responseData.map((data) => {
        const date = new Date(data.created_at);

        // Format Date
        const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Manila' };
        const formattedDate = new Intl.DateTimeFormat('en-CA', optionsDate).format(date);

        // Format time
        const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Manila' };
        let formattedTime = new Intl.DateTimeFormat('en-US', optionsTime).format(date);
        formattedTime = formattedTime.replace(/\s/g, '');

        return{
          id: data.id,
          date: `${formattedDate} ${formattedTime}`,
          category: data.category,
          message: data.message,
        }

      });

      showGetLogs({LogsData});
      //console.log({LogsData});
    })
    .catch((error)=>{
      console.log(error);
    })
    .finally(() => {
      getLoadingLogs(false);
    });
  }

  //Generate PDF
  const [isVisible, setIsVisible] = useState(false);
  const [seconds, setSeconds] = useState(3);

  const componentRef= useRef();

  // For Print Layout
  const injectPDFStyles = () => {
    const pdfStyles = `
      @page {
        margin: 18mm 5mm 5mm 5mm; /* Top, Right, Bottom, Left margins */
        @bottom-right {
          content: "Page " counter(page) " of " counter(pages);
          font-size: 12px;
          font-family: Arial, sans-serif;
        }
      }
    `;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.media = 'print';
    style.innerHTML = pdfStyles;
    document.head.appendChild(style);
    return style;
  };
  
  const generatePDF = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: `Logs-${fromDate}to${toDate}`,
    onBeforeGetContent: () => {
      // Inject PDF-specific styles before printing
      injectPDFStyles();
    },
    onAfterPrint: () => {
      // Remove the injected styles after printing
      const styles = document.querySelectorAll('style[media="print"]');
      styles.forEach((style) => style.remove());
    },
  });

  const handleButtonClick = () => {
    setIsVisible(true); 
    setSeconds(3);
    setSubmitLoading(true);
    setTimeout(() => {
      generatePDF();
      setSubmitLoading(false);
      setIsVisible(false); 
    }, 1000);
  };

  useEffect(() => {
    let timer;

    if (isVisible && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isVisible, seconds]);

  useEffect(() => {
    if (seconds === 0) {
      setIsVisible(false);
      setSubmitLoading(false);
    }
  }, [seconds]);

  return(
    <PageComponent title="Logs">

      {/* Main */}
      <div className="font-roboto ppa-form-box">
        <div className="ppa-form-header h-10"></div>
        <div style={{ padding: '6px 10px 10px 10px' }}>

          {/* Date Range */}
          <div className="flex items-center justify-center space-x-2 mt-4 mb-4">
            
            {/* From Date */}
            <div className="flex items-center space-x-4">
              <label htmlFor="from_date" className="block w-10 text-base font-medium leading-6 text-black">
                From:
              </label>
              <input
                type="date"
                name="from_date"
                id="from_date"
                defaultValue={today}
                onChange={ev => setFromDate(ev.target.value)}
                className="block w-40 ppa-form"
              />
            </div>

            {/* To Date */}
            <div className="flex items-center space-x-4">
              <label htmlFor="to_date" className="block w-4 text-base font-medium leading-6 text-black">
                To:
              </label>
              <input
                type="date"
                name="to_date"
                id="to_date"
                defaultValue={today}
                min={fromDate}
                onChange={(ev) => handleToDateChange(ev)}
                className="block w-40 ppa-form"
              />
            </div>

            {/* From Button */}
            {submitButton ? (
            <>
              <div className="flex items-center space-x-4">
                <button 
                  type="submit"
                  onClick={getLogsInfo}
                  className="py-2 px-4 $ btn-default"
                >
                  Go
                </button>
              </div>
              
              {logsFunction ? (
                <div className="flex items-center space-x-4">
                  <button type="button" onClick={handleButtonClick}
                    className={`px-4 py-2 btn-pdf ${ submitLoading && 'btn-genpdf'}`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? (
                      <div className="flex items-center justify-center">
                        <img src={submitAnimation} alt="Submit" className="h-5 w-5" />
                        <span className="ml-2">Generating</span>
                      </div>
                    ) : (
                      'Get PDF'
                    )}
                  </button>
                </div>
              ):null}

              </>
            ):null}

          </div>

          {logsFunction ? (
          <>
            {/* Table */}
            <table className="ppa-table w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-1 py-1 w-44 text-left text-sm font-medium text-gray-600 uppercase">Date and Time</th>
                  <th className="px-1 py-1 w-20 text-center text-sm font-medium text-gray-600 uppercase">Category</th>
                  <th className="px-1 py-1 w-96 text-center text-sm font-medium text-gray-600 uppercase">Description</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: '#fff' }}>
                {loadingLogs ? (
                  <tr>
                    <td colSpan={3} className="px-1 py-3 text-base text-center border-0 border-custom">
                      <div className="flex justify-center items-center">
                        <img className="h-8 w-auto mr-1" src={loading_table} alt="Loading" />
                        <span className="loading-table">Loading Logs</span>
                      </div>
                    </td>
                  </tr>
                ):(
                <>
                  {getLogs?.LogsData?.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-1 py-3 text-base text-center border-0 border-custom"> No Logs </td>
                    </tr>
                  ):(
                  <>
                    {getLogs?.LogsData?.map((data) => (
                      <tr key={data.id}>
                        <td className="px-1 py-1.5 text-left table-font text-base">{data?.date}</td>
                        <td className="px-1 py-1.5 text-center table-font text-base">{data?.category}</td>
                        <td className="px-1 py-1.5 text-center table-font text-base">{data?.message}</td>
                      </tr>
                    ))}
                  </>
                  )}
                </>
                )}
              </tbody>
            </table>
          </>
          ):null}
          
        </div>
      </div>

      {/* PDF */}
      <div>
        <div className="hidden md:none font-roboto logs-pdf">
          <div ref={componentRef}>
            <div style={{ width: '210mm', height: '297mm', paddingLeft: '15px', paddingRight: '15px', paddingTop: '10px', border: '0px solid' }}>

              {/* Title */}
              <div>
                <div className="logs-title-company">Philippine Ports Authority - PMO Lanao Del Norte / Iligan</div>
                <div className="logs-title-system"> Joint Local Management System Logs </div>
                <div className="logs-title-date"> {fromDate} to {toDate} </div>
              </div>

              {/* Table */}
              <div>
                <table className="ppa-table w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-1 py-1 w-44 text-left text-sm font-medium text-gray-600 uppercase">Date and Time</th>
                      <th className="px-1 py-1 w-20 text-center text-sm font-medium text-gray-600 uppercase">Category</th>
                      <th className="px-1 py-1 w-96 text-center text-sm font-medium text-gray-600 uppercase">Message</th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: '#fff' }}>
                    {getLogs?.LogsData?.map((data) => (
                      <tr key={data.id}>
                        <td className="px-1 py-1.5 text-left table-font text-base">{data?.date}</td>
                        <td className="px-1 py-1.5 text-center table-font text-base">{data?.category}</td>
                        <td className="px-1 py-1.5 text-center table-font text-base">{data?.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>

    </PageComponent>
  );
}