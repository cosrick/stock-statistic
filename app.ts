import { NO_DATA_DESCRIPTION, DividendCsvTitle } from './constants';
import { StockData } from './models';
import requestData from './request-data';
import dayjs from 'dayjs';
import { 
  createObjectCsvWriter,
} from 'csv-writer';

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function trans(d: string): Promise<StockData[] | null> {
  await sleep(5000);

  return new Promise<StockData[] | null>((resolve, reject) => {
    requestData(d).then(({ data: stockReport }) => {
      if (stockReport.stat === NO_DATA_DESCRIPTION) {
        resolve(null);
      }

      const stockData = stockReport.data.splice(0, 5).map((dataList: (string | number)[]): StockData => {
        const [code, name, dividend, year, PER, PBR, season] = dataList;
    
        return <StockData> {
          code,
          name,
          dividend,
          year,
          PER,
          PBR,
          season,
        }
      })

      resolve(stockData);

    }).catch(reject);
  
  })

}


async function main(): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const dividendMapping: {[key: string]: any} = {};
    // const arr = Array(20).fill(null).map((_, i) => dayjs().subtract(i, 'day').format('YYYYMMDD'));
    const arr = ['20220117'];

    try {

      for (const d of arr) {
        console.log(d);
        const output = await trans(d);    
        if (output) {
          console.log(output[0]);
          output.forEach((data) => {
            if (!(data.code in dividendMapping)) {
              dividendMapping[data.code] = {
                name: data.name,
                code: data.code,
              }
            }
            Object.assign(dividendMapping[data.code], {
              [d]: data.dividend,
            })
          })
        };
      }

      resolve(dividendMapping);
    } catch (error) {
      reject(error);
    }

  })
};

main().then((result) => {
  console.log('------');
  console.log('result', JSON.stringify(result, null, 2));
  console.log('Values: ', JSON.stringify(Object.values(result), null, 2));

  DividendCsvTitle.push({
    id: '20220117',
    title: '20220117',
  })

  // Write Files
  const csvWriter = createObjectCsvWriter({
    path: __dirname + '/online.csv',
    header: DividendCsvTitle,
  });
  csvWriter.writeRecords(Object.values(result)).catch();

}).catch((error) => {
  console.error(error);
})