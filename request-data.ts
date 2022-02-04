import axios from 'axios';

export default async function(dateString: string): Promise<any> {

  return axios({
    method: 'GET',
    url: `https://www.twse.com.tw/exchangeReport/BWIBBU_d?response=json&date=${dateString}&selectType=ALL`,
  });

}