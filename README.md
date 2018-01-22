# database-schema-tester

Update the schema in index.js by copying and pasting directly from a Google spreadsheet to paste in CSV formatted data. The tables must be separated by exactly one newline, the first row of every block must be the table name, the second line must be column names, and the remaining lines must be string data. Only string data types are supported. 

```bash
npm i
npm run dev:db # in one tab
npm run dev # In separate tab
```
