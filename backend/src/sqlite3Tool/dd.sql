PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE exam(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "hid" INTEGER,
  "name" text(255),
  "time" text(255) NOT NULL,
  "age" integer(11),
  "sex" text(1),
  "thxhdb" real,
  "gaxztm" text(255),
  "rstqm" text(255),
  "dmdzdb" text(255),
  "qbdb" text(255),
  "ns1" text(255),
  "ns2" text(255),
  "zdgc" text(255),
  "zdzs" text(255),
  "zdhs" text(255),
  "zdb" text(255),
  "qdb" text(255),
  "gysz" text(255),
  "bqb" text(255),
  "bdb" text(255),
  "zjdhs" text(255),
  "jxlsm" text(255),
  "jg" text(255),
  "jsjm" text(255),
  "djzm" text(255),
  "zdba" text(255),
  "ptt" text(255),
  "zzdba1" text(255),
  "zzdbb" text(255),
  "jjdhs" text(255),
  "gmdzdb" text(255)
);

CREATE TABLE history (

  "id" INTEGER PRIMARY KEY AUTOINCREMENT,

  "time" text(255) NOT NULL,

  "desc" text(255),

  "isDesc" integer(11),

  "isExam" integer(11),

  "prob" real,

  "name" text(255),

  CONSTRAINT "id" FOREIGN KEY ("id") REFERENCES "exam" ("hid") ON DELETE RESTRICT ON UPDATE RESTRICT

);

CREATE TABLE readmission (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "race" integer(11),
  "sex" integer(11),
  "age" integer(11),
  "admissionType" integer(11),
  "discharge" integer(11),
  "admissionSource" integer(11),
  "timeHospital" integer(11),
  "numLab" integer(11),
  "numProcedures" integer(11),
  "numMedications" integer(11),
  "numOutpatient" integer(11),
  "numEmergency" integer(11),
  "numInpatient" integer(11),
  "numDiagnoses" integer(11),
  "maxGluSerum" integer(11),
  "a1Result" integer(11),
  "metformin" integer(11),
  "repaglinide" integer(11),
  'nateglinide' integer(11),	
  "chlorpropamide" integer(11),	
  "glimepiride" integer(11),
  "acetohexamide" integer(11),	
  "glipizide" integer(11),	
  "glyburide" integer(11),	
  "tolbutamide" integer(11),	
  "pioglitazone" integer(11),	
  "rosiglitazone" integer(11),	
  "acarbose" integer(11),	
  "miglitol" integer(11),	
  "troglitazone" integer(11),	
  "tolazamide" integer(11),	
  "examide" integer(11),	
  "citoglipton" integer(11),	
  "insulin" integer(11),
  "glyburideMetformin" integer(11),	
  "glipizideMetformin" integer(11),	
  "glimepiridePioglitazone" integer(11),	
  "metforminRosiglitazone" integer(11),	
  "metforminPioglitazone" integer(11),
  "change" integer(11),
  "diabetesMed" integer(11),
  "proba" real
);

INSERT INTO readmission (race, sex, age, admissionType, discharge, admissionSource, timeHospital, numLab, numProcedures, numMedications, numOutpatient, numEmergency, numInpatient, numDiagnoses, maxGluSerum, a1Result, metformin, repaglinide, nateglinide,	chlorpropamide,	glimepiride, acetohexamide,	glipizide, glyburide, tolbutamide, pioglitazone,	rosiglitazone, acarbose, miglitol, troglitazone, tolazamide, examide,	citoglipton,	insulin,glyburideMetformin,	glipizideMetformin,	glimepiridePioglitazone, metforminRosiglitazone, metforminPioglitazone, change, diabetesMed, proba)
VALUES('0','0','0','0',0,'0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0', '0.23');