const store = {
  document: {
    8: { id: 8, report_id: 4, name: 'Sample Document', filetype: 'txt' },
    34: { id: 34, report_id: 21, name: 'Quarterly Report', filetype: 'pdf' },
    87: { id: 87, report_id: 21, name: 'Performance Summary', filetype: 'pdf' },
  },
  page: {
    19: { id: 19, document_id: 34, body: 'Lorem ipsum...', footnote: null },
    72: { id: 72, document_id: 87, body: 'Ut aliquet...', footnote: 'Aliquam erat...' },
    205: { id: 205, document_id: 34, body: 'Donec a dui et...', footnote: null },
  },
  report: {
    4: { id: 4, title: 'Sample Report' },
    21: { id: 21, title: 'Portfolio Summary 2020' },
  },
}

//
// Part 2
//

// Question 1
const documentPages = (documentId) => {
    const pages = Object.values(store.page);

    return pages.filter(page => page.document_id == documentId);
}

const reportDocuments = reportId => {
    const documents = Object.values(store.document);

    return documents.filter(doc => doc.report_id == reportId);
}

const reportPages = id => {
    let pages = [];
    const documents = store.document;

    for(const documentId in documents) {
        const document = documents[documentId];
        const reportId = document.report_id;

        if(reportId !== id)
            continue;

        const docPages = documentPages(documentId);
        pages = pages.concat(docPages);
    }

    return pages;
}

/**
 * Gets the number of pages in a report.
 * 
 * @param { Number }    id     Report Id.
 * 
 * @return { Number } Number of pages in a report.
 */
const reportPageCount = (id) => reportPages(id).length;

// Question 2

const reportMatches = (report, term) => {
    const reportId = report.id;

    // check if the pages in the report match the search term
    const pages = reportPages(reportId);

    for(let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const body = page.body;
        const footnote = page.footnote;

        if(body && body.includes(term))
            return true;

        if(footnote && footnote.includes(term))
            return true;
    }

    // check if the document name matches the search term
    const documents = reportDocuments(reportId);

    for(const document of documents) {
        const name = document.name;

        if(name && name.includes(term))
            return true;
    }

    // check if the report itself matches the search term
    const title = report.title;

    return title.includes(term);
}

/**
 * Find reports matching a search term.
 * 
 * @param { string }    term     Search term.
 * 
 * @return { Report[] } Reports matching the search term.
 */
const searchReports = term => {
    const matching = [];
    const reports = store.report;

    for(const reportId in reports) {
        const report = reports[reportId];
        const matches = reportMatches(report, term);

        if(!matches)
            continue;

        matching.push(report);
    }

    return matching;
}


// Run part 1
console.log(reportPageCount(21));

// Run part 2
console.log(searchReports("Document"));


// Question 3

//// Part 1

/*

If I were to convert the searcReports function into an asynchronous function,
the function signature would have to change accordingly:

    const searchReports = async term => { ... }

The async keyword is required because in this case I chose to use the 
async/await syntax for asynchronous functions. I believe this would result in
cleaner code for this library. 

The programmer using the searchReports function would simply call the function
as follows:

    const matchingReports = await searchReports(term);

searchReports would then access the API, await the result of the data 
asynchronously and then search the data in much the same way that the current
synchronous code from Part 1 does.

This is why I believe the async/await pattern is the optimal choice, over 
promise chaining or callbacks. Promise chaining would require a much more 
involved rewrite of the current synchronous code in order to convert it to 
asynchronous execution. Callbacks, in my opinion, would also be the wrong 
choice for the job because it would result in deeply nested code, and in my
experience it is much less readable than async/await code.

*/

//// Part 2

/*

API access over a network introduces the possibility of unreliability to the
searchReports function. If the API is unable to be reached or if it returns 
an internal error, it will prevent the searchReports function from running.
Exception handling in an async/await function is done with a try/catch block,
the region of code that would interact with the API could simply be wrapped in
a try/catch block and it would be able to recover from a server side or network
error. The searchReports function could then throw it's own exception or return
null to alert the caller that the function was unable to properly execute.

*/