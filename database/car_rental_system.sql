-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: car_rental_system
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `cust_id` int NOT NULL AUTO_INCREMENT,
  `cust_name` varchar(100) NOT NULL,
  `cust_email` varchar(100) NOT NULL,
  `cust_phone` varchar(15) DEFAULT NULL,
  `cust_address` varchar(255) DEFAULT NULL,
  `driving_license_no` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cust_id`),
  UNIQUE KEY `cust_email` (`cust_email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (3,'Ravi Kumar','ravi.kumar@gmail.com','9876543210','12A, Anna Nagar, Chennai','TN12 2021 4567890','ravi@123'),(4,'Priya Sharma','priya.sharma@yahoo.com','9123456780','45B, Indiranagar, Bangalore','KA09 2020 9988776','priya@456'),(5,'Arjun Mehta','arjun.mehta@gmail.com','9001122334','88C, Banjara Hills, Hyderabad','TS10 2022 1122334','arjun@789'),(6,'Sneha Patel','sneha.patel@gmail.com','9090876543','23, Satellite, Ahmedabad','GJ01 2019 5566778','sneha@321'),(7,'Rahul Verma','rahul.verma@gmail.com','9823456701','19, Koregaon Park, Pune','MH12 2023 3344556','rahul@999');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `emp_id` int NOT NULL AUTO_INCREMENT,
  `emp_name` varchar(100) NOT NULL,
  `emp_email` varchar(100) NOT NULL,
  `emp_phone` varchar(15) DEFAULT NULL,
  `emp_role` enum('Manager','Staff') DEFAULT 'Staff',
  `manager_id` int DEFAULT NULL,
  PRIMARY KEY (`emp_id`),
  UNIQUE KEY `emp_email` (`emp_email`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `employee` (`emp_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'Amit Verma','amit.verma@cargo.in','9876543210','Manager',NULL),(2,'Priya Sharma','priya.sharma@cargo.in','9876543211','Manager',NULL),(3,'Ravi Kumar','ravi.kumar@cargo.in','9876543212','Manager',NULL),(4,'Lakshmi Nair','lakshmi.nair@cargo.in','9876543213','Staff',1),(5,'Vikram Patel','vikram.patel@cargo.in','9876543214','Staff',1),(6,'Sanjay Mehta','sanjay.mehta@cargo.in','9876543215','Staff',1),(7,'Neha Joshi','neha.joshi@cargo.in','9876543216','Staff',2),(8,'Arjun Singh','arjun.singh@cargo.in','9876543217','Staff',2),(9,'Kiran Das','kiran.das@cargo.in','9876543218','Staff',2),(10,'Deepa Menon','deepa.menon@cargo.in','9876543219','Staff',3),(11,'Rahul Pillai','rahul.pillai@cargo.in','9876543220','Staff',3),(12,'Sneha Iyer','sneha.iyer@cargo.in','9876543221','Staff',3),(13,'Gaurav Chauhan','gaurav.chauhan@cargo.in','9876543222','Staff',3),(14,'Meena Reddy','meena.reddy@cargo.in','9876543223','Staff',3),(15,'Harish Babu','harish.babu@cargo.in','9876543224','Staff',3);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `rent_id` int NOT NULL,
  `cust_id` int NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` enum('Cash','Card','Online') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`payment_id`),
  KEY `rent_id` (`rent_id`),
  KEY `cust_id` (`cust_id`),
  CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`rent_id`) REFERENCES `rent` (`rent_id`) ON DELETE CASCADE,
  CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`cust_id`) REFERENCES `customer` (`cust_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,1,1,'2025-10-12','Card',5000.00),(2,2,2,'2025-10-15','Online',8500.00);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rent`
--

DROP TABLE IF EXISTS `rent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rent` (
  `rent_id` int NOT NULL AUTO_INCREMENT,
  `reservation_id` int NOT NULL,
  `rent_date` date NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`rent_id`),
  UNIQUE KEY `reservation_id` (`reservation_id`),
  CONSTRAINT `rent_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rent`
--

LOCK TABLES `rent` WRITE;
/*!40000 ALTER TABLE `rent` DISABLE KEYS */;
INSERT INTO `rent` VALUES (1,1,'2025-10-12',5000.00),(2,2,'2025-10-15',8500.00);
/*!40000 ALTER TABLE `rent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rentvehicle`
--

DROP TABLE IF EXISTS `rentvehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rentvehicle` (
  `rent_id` int NOT NULL,
  `vehicle_id` int NOT NULL,
  PRIMARY KEY (`rent_id`,`vehicle_id`),
  KEY `vehicle_id` (`vehicle_id`),
  CONSTRAINT `rentvehicle_ibfk_1` FOREIGN KEY (`rent_id`) REFERENCES `rent` (`rent_id`) ON DELETE CASCADE,
  CONSTRAINT `rentvehicle_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rentvehicle`
--

LOCK TABLES `rentvehicle` WRITE;
/*!40000 ALTER TABLE `rentvehicle` DISABLE KEYS */;
INSERT INTO `rentvehicle` VALUES (1,1),(2,2);
/*!40000 ALTER TABLE `rentvehicle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `reservation_id` int NOT NULL AUTO_INCREMENT,
  `cust_id` int NOT NULL,
  `emp_id` int DEFAULT NULL,
  `vehicle_id` int DEFAULT NULL,
  `reservation_date` date NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('Booked','Cancelled','Completed') DEFAULT 'Booked',
  `pickup_location` varchar(100) DEFAULT NULL,
  `cancel_details` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`reservation_id`),
  KEY `cust_id` (`cust_id`),
  KEY `emp_id` (`emp_id`),
  KEY `vehicle_id` (`vehicle_id`),
  CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`cust_id`) REFERENCES `customer` (`cust_id`) ON DELETE CASCADE,
  CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`) ON DELETE SET NULL,
  CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

LOCK TABLES `reservation` WRITE;
/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (1,1,2,1,'2025-10-10','2025-10-12','2025-10-14','Booked',NULL,NULL),(2,2,3,2,'2025-10-11','2025-10-15','2025-10-18','Booked',NULL,NULL);
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle` (
  `vehicle_id` int NOT NULL AUTO_INCREMENT,
  `reg_no` varchar(20) NOT NULL,
  `model` varchar(100) NOT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `manufacture_year` year NOT NULL DEFAULT '2022',
  `vehicle_type` enum('Car','Bike','SUV','Van') DEFAULT NULL,
  `status` enum('Available','Rented','Maintenance') DEFAULT 'Available',
  `emp_id` int DEFAULT NULL,
  `rent_per_day` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`vehicle_id`),
  UNIQUE KEY `reg_no` (`reg_no`),
  KEY `emp_id` (`emp_id`),
  CONSTRAINT `vehicle_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle`
--

LOCK TABLES `vehicle` WRITE;
/*!40000 ALTER TABLE `vehicle` DISABLE KEYS */;
INSERT INTO `vehicle` VALUES (12,'TN01AB001','Dzire','Maruti Suzuki',2021,'Car','Available',4,1500.00),(13,'TN01AB002','Dzire','Maruti Suzuki',2022,'Car','Available',5,1500.00),(14,'TN01AB003','Dzire','Maruti Suzuki',2023,'Car','Available',6,1500.00),(15,'TN02CD001','City','Honda',2022,'Car','Available',7,2000.00),(16,'TN02CD002','City','Honda',2023,'Car','Available',8,2000.00),(17,'TN03EF001','Virtus','Volkswagen',2022,'Car','Available',9,2500.00),(18,'TN03EF002','Virtus','Volkswagen',2023,'Car','Available',10,2500.00),(19,'TN03EF003','Virtus','Volkswagen',2024,'Car','Available',11,2500.00),(20,'TN04GH001','Innova','Toyota',2022,'SUV','Available',12,3500.00),(21,'TN04GH002','Innova','Toyota',2023,'SUV','Available',13,3500.00),(22,'TN05IJ001','M4','BMW',2024,'Car','Available',14,7000.00);
/*!40000 ALTER TABLE `vehicle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicleavailability`
--

DROP TABLE IF EXISTS `vehicleavailability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicleavailability` (
  `vehicle_id` int NOT NULL,
  `available_from` date NOT NULL,
  `available_to` date NOT NULL,
  `status` enum('Available','Booked') DEFAULT 'Available',
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`vehicle_id`,`available_from`),
  CONSTRAINT `vehicleavailability_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicleavailability`
--

LOCK TABLES `vehicleavailability` WRITE;
/*!40000 ALTER TABLE `vehicleavailability` DISABLE KEYS */;
INSERT INTO `vehicleavailability` VALUES (12,'2025-10-22','2025-10-25','Available','2025-10-21 08:43:28'),(13,'2025-10-23','2025-10-28','Available','2025-10-21 08:43:28'),(14,'2025-10-24','2025-10-30','Available','2025-10-21 08:43:28'),(15,'2025-10-22','2025-10-26','Available','2025-10-21 08:43:28'),(16,'2025-10-23','2025-10-29','Available','2025-10-21 08:43:28'),(17,'2025-10-24','2025-10-31','Available','2025-10-21 08:43:28'),(18,'2025-10-25','2025-11-01','Available','2025-10-21 08:43:28'),(19,'2025-10-26','2025-11-02','Available','2025-10-21 08:43:28'),(20,'2025-10-22','2025-10-27','Available','2025-10-21 08:43:28'),(21,'2025-10-23','2025-10-28','Available','2025-10-21 08:43:28'),(22,'2025-10-24','2025-10-30','Available','2025-10-21 08:43:28');
/*!40000 ALTER TABLE `vehicleavailability` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-21 14:14:24
