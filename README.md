# Simple-RDBMS

A stupidly simple implementation of an RDBMS in node. This project's purpose is to demonstrate how the SQL Server storage engine organizes and stores table data on disk.

## What Does This Database Cover?

- Data records in heap tables and clustered index B-trees

## Record Structure

Not allowing for forwarding/forwarded records, LOB data, or records with a versioning tag. This DB only stores "basic" table data.

SQL Server (and other RDBMS's) store data as 1s and 0s, this 

|Portion|SQL Server|SimpleRDBMS|
|---|---|---|
|Record Header|4 Bytes<br/>Two Bytes for record metadata<br/>Two bytes pointing forward into the record to the Null Bitmap|4 Chars<br/>1 Char for the record metadata<br/>3 Chars pointing forward into the record to the Null Bitmap|
|Fixed Length Columns|Stores all data with fixed-size data types||
|Null Bitmap|Two bytes for the count of columns in the record<br/>Variable number of bytes to store one bit per column indicating whether or not the column is Null|Two chars for the count of columns in the record<br/>1 char per column indicating whether or not the column is Null|
|Variable-length column offset array|Two bytes for the count of variable-length columns.<br/>Two bytes per variable length column, giving the offset to the end of the column value.|Two chars for the count of variable-length columns.<br/>Four chars per variable length column, giving the offset to the end of the column value.|
|Variable Length Columns|Stores all column data with variable-sized data types||