const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const getHtml = async (url) => {
  try {
    return await axios.get(url);
  } catch (error) {
    console.error(error);
  }
};

const getTableData = async (url) => {
  const html = await getHtml(url);
  const $ = cheerio.load(html.data);
  const $tableBody = $("tbody");
  const tableData = [];
  $tableBody.children("tr").each(function (i, elem) {
    // table structure:
    //        <tr>
    //             <th>Datum</th>
    //             <th>Namn</th>
    //             <th>Vecka</th>
    //             <th>Veckodag</th>
    //             <th>Dag på året</th>
    //         </tr>

    tableData[i] = {
      date: $(this).find("td").eq(0).text(),
      name: $(this).find("td").eq(1).text(),
      week: $(this).find("td").eq(2).text(),
      weekday: $(this).find("td").eq(3).text(),
      dayOfTheYear: $(this).find("td").eq(4).text(),
    };

    // save table data to file
    fs.appendFile(
      "tableData.json",
      `${JSON.stringify(tableData[i])},`,
      (err) => {
        if (err) {
          throw err;
        }
        console.log("The data was appended to file!");
      }
    );
  });
};

for (let i = 10; i < 100; i++) {
  getTableData(`https://www.kalender.se/helgdagar/19${i}`);
}

module.exports = { getHtml, getTableData };
