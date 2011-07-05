var en_db_queries = [];
en_db_queries.push('CREATE TABLE en_keyword_tbl (  id INTEGER,  keyword VARCHAR NOT NULL UNIQUE,  custom INTEGER DEFAULT 1,  PRIMARY KEY (id))');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(1,\'agriculture\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(2,\'cash surplus/deficit\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(3,\'cash surplus\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(4,\'cash deficit\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(5,\'goods and services\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(6,\'gross domestic product\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(7,\'GDP\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(8,\'gross capital\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(9,\'industry\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(10,\'inflation\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(11,\'GDP deflator\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(12,\'revenue\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(13,\'services\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(14,\'manufacturing\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(15,\'energy production\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(16,\'rural population\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(17,\'urban population\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(18,\'agricultural land\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(19,\'CO2\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(20,\'power consumption\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(21,\'energy use\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(22,\'forest area\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(23,\'sanitation facilities\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(24,\'water source\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(25,\'freshwater resources\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(26,\'debt\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(27,\'foreign investment\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(28,\'merchandise\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(29,\'net migration\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(30,\'official development assistance\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(31,\'official aid\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(32,\'workers\'\' remittances\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(33,\'workers remittances\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(34,\'worker remittance\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(35,\'compensation of employees\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(36,\'employee compensation\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(37,\'employees compensations\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(38,\'employees\'\' compensations\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(39,\'unemployment\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(40,\'adolescent fertility\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(41,\'births attended\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(42,\'attended births\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(43,\'attended birth\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(44,\'contraception\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(45,\'contraceptive\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(46,\'fertility rate\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(47,\'measles\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(48,\'income share\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(49,\'life expectancy\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(50,\'malnutrition\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(51,\'infant mortality\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(52,\'AIDS\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(53,\'HIV\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(54,\'primary completion rate\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(55,\'primary and secondary education\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(56,\'primary education\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(57,\'secondary education\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(58,\'IMF\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(59,\'international monetary fund\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(60,\'research\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(61,\'R&D\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(62,\'high-technology\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(63,\'internet users\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(64,\'market capitalization\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(65,\'stock market\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(66,\'military\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(67,\'health expenditure\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(68,\'mobile cellular\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(69,\'mobile phone\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(70,\'roads, paved\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(71,\'paved roads\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(72,\'start a business\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(73,\'start business\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(74,\'GNI\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(75,\'gross national income\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(76,\'population growth\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(77,\'population, total\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(78,\'population total\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(79,\'total population\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(80,\'population density\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(81,\'poverty\',0)');
en_db_queries.push('INSERT INTO "en_keyword_tbl" VALUES(82,\'surface area\',0)');
en_db_queries.push('CREATE TABLE en_keyword_to_indicator_tbl (  id INTEGER,  keyword_id INTEGER,   indicator_id INTEGER,  PRIMARY KEY (id),  UNIQUE (keyword_id, indicator_id))');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(1,1,1)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(2,2,4)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(3,3,4)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(4,4,4)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(5,5,5)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(6,6,7)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(7,7,7)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(8,8,10)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(9,9,11)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(10,10,12)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(11,11,12)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(12,12,13)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(13,13,14)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(14,14,15)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(15,15,16)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(16,16,18)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(17,17,19)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(18,18,2)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(19,19,20)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(20,20,22)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(21,21,17)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(22,22,3)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(23,23,23)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(24,24,24)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(25,25,25)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(26,26,26)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(27,27,28)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(28,28,29)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(29,29,31)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(30,30,32)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(31,31,32)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(32,32,33)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(33,33,33)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(34,34,33)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(35,35,33)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(36,36,33)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(37,37,33)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(38,38,33)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(39,39,34)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(40,40,35)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(41,41,39)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(42,42,39)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(43,43,39)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(44,44,36)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(45,45,36)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(46,46,37)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(47,47,40)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(48,48,43)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(49,49,38)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(50,50,41)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(51,51,44)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(52,52,42)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(53,53,42)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(54,54,46)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(55,55,47)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(56,56,47)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(57,57,47)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(58,58,48)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(59,59,48)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(60,60,49)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(61,61,49)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(62,62,50)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(63,63,51)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(64,64,54)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(65,65,54)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(66,66,55)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(67,67,56)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(68,68,53)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(69,69,53)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(70,70,58)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(71,71,58)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(72,72,59)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(73,73,59)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(74,74,63)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(75,75,63)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(76,76,64)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(77,77,65)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(78,78,65)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(79,79,65)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(80,80,66)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(81,81,67)');
en_db_queries.push('INSERT INTO "en_keyword_to_indicator_tbl" VALUES(82,82,68)');
en_db_queries.push('CREATE TABLE en_indicator_name_tbl (  id INTEGER,  indicator_id INTEGER UNIQUE,  indicator_name VARCHAR NOT NULL UNIQUE,  PRIMARY KEY (id))');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(1,1,\'Agriculture, value added (% of GDP)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(2,4,\'Cash surplus/deficit (% of GDP)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(3,5,\'Exports of goods and services (% of GDP)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(4,7,\'GDP (current US$)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(5,8,\'GDP growth (annual %)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(6,9,\'GDP per capita (current US$)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(7,10,\'Gross capital formation (% of GDP)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(8,6,\'Imports of goods and services (% of GDP)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(9,11,\'Industry, value added (% of GDP)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(10,12,\'Inflation, GDP deflator (annual %)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(11,13,\'Revenue, excluding grants (% of GDP)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(12,14,\'Services, etc., value added (% of GDP)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(13,15,\'Manufacturing, value added (% of GDP)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(14,16,\'Energy production (kt of oil equivalent)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(15,18,\'Rural population (% of total population)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(16,19,\'Urban population (% of total)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(17,2,\'Agricultural land (% of land area)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(18,20,\'CO2 emissions (kt)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(19,21,\'CO2 emissions (metric tons per capita)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(20,22,\'Electric power consumption (kWh per capita)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(21,17,\'Energy use (kg of oil equivalent per capita)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(22,3,\'Forest area (sq. km)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(23,23,\'Improved sanitation facilities, urban (% of urban population with access)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(24,24,\'Improved water source (% of population with access)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(25,25,\'Renewable internal freshwater resources per capita (cubic meters)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(26,26,\'External debt stocks, total (DOD, current US$)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(27,28,\'Foreign direct investment, net inflows (BoP, current US$)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(28,29,\'Merchandise trade (% of GDP)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(29,30,\'Net barter terms of trade (2000 = 100)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(30,31,\'Net migration\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(31,32,\'Official development assistance and official aid (current US$)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(32,27,\'Total debt service (% of exports of goods, services and income)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(33,33,\'Workers\'\' remittances and compensation of employees, received (current US$)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(34,34,\'Unemployment, total (% of total labor force)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(35,35,\'Adolescent fertility rate (births per 1,000 women ages 15-19)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(36,39,\'Births attended by skilled health staff (% of total)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(37,36,\'Contraceptive prevalence (% of women ages 15-49)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(38,37,\'Fertility rate, total (births per woman)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(39,40,\'Immunization, measles (% of children ages 12-23 months)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(40,43,\'Income share held by lowest 20%\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(41,38,\'Life expectancy at birth, total (years)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(42,41,\'Malnutrition prevalence, weight for age (% of children under 5)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(43,44,\'Mortality rate, infant (per 1,000 live births)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(44,45,\'Mortality rate, under-5 (per 1,000)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(45,42,\'Prevalence of HIV, total (% of population ages 15-49)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(46,46,\'Primary completion rate, total (% of relevant age group)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(47,47,\'Ratio of girls to boys in primary and secondary education (%)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(48,48,\'Use of IMF credit (DOD, current US$)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(49,49,\'Researchers in R&D (per million people)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(50,50,\'High-technology exports (% of manufactured exports)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(51,51,\'Internet users\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(52,52,\'Internet users (per 100 people)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(53,54,\'Market capitalization of listed companies (% of GDP)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(54,55,\'Military expenditure (% of GDP)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(55,56,\'Health expenditure, total (% of GDP)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(56,57,\'Health expenditure per capita (current US$)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(57,53,\'Mobile cellular subscriptions (per 100 people)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(58,58,\'Roads, paved (% of total roads)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(59,59,\'Time required to start a business (days)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(60,60,\'GNI per capita PPP (current international $)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(61,61,\'GNI per capita, Atlas method (current US$)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(62,62,\'GNI, Atlas method (current US$)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(63,63,\'GNI, PPP (current international $)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(64,64,\'Population growth (annual %)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(65,65,\'Population, total\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(66,66,\'Population density (people per sq. km of land area)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(67,67,\'Poverty headcount ratio at national poverty line (% of population)\')');
en_db_queries.push('INSERT INTO "en_indicator_name_tbl" VALUES(68,68,\'Surface area (sq. km)\')');
en_db_queries.push('CREATE TABLE en_category_name_tbl (  id INTEGER,  category_id INTEGER UNIQUE,  category_name VARCHAR NOT NULL UNIQUE,   PRIMARY KEY (id))');
en_db_queries.push('INSERT INTO "en_category_name_tbl" VALUES(1,1,\'Economy\')');
en_db_queries.push('INSERT INTO "en_category_name_tbl" VALUES(2,2,\'Environment\')');
en_db_queries.push('INSERT INTO "en_category_name_tbl" VALUES(3,3,\'Global Links\')');
en_db_queries.push('INSERT INTO "en_category_name_tbl" VALUES(4,4,\'People\')');
en_db_queries.push('INSERT INTO "en_category_name_tbl" VALUES(5,5,\'States and markets\')');
en_db_queries.push('INSERT INTO "en_category_name_tbl" VALUES(6,6,\'World view\')');
en_db_queries.push('INSERT INTO "en_category_name_tbl" VALUES(7,7,\'Other\')');
