** Steps to install database backup **

Unzip the *.zip file

** Drop database / create the database **

psql -U postgres -c "drop database"
psql -U postgres -c "create database hostel_dev"

** restore database **
psql -U postgres -d hostel_dev < "name of the database file"


