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
  PRIMARY KEY (`cust_id`),
  UNIQUE KEY `cust_email` (`cust_email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'Ravi Kumar','ravi@gmail.com','9876001111','Chennai'),(2,'Priya Sharma','priya@gmail.com','9876002222','Bangalore');
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'John Manager','john@carrent.com','9876543210','Manager',NULL),(2,'Sara Staff','sara@carrent.com','9876501234','Staff',NULL),(3,'Alex Staff','alex@carrent.com','9876505678','Staff',NULL);
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
INSERT INTO `reservation` VALUES (1,1,2,1,'2025-10-10','2025-10-12','2025-10-14','Booked'),(2,2,3,2,'2025-10-11','2025-10-15','2025-10-18','Booked');
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
  `vehicle_type` enum('Car','Bike','SUV','Van') DEFAULT NULL,
  `status` enum('Available','Rented','Maintenance') DEFAULT 'Available',
  `emp_id` int DEFAULT NULL,
  PRIMARY KEY (`vehicle_id`),
  UNIQUE KEY `reg_no` (`reg_no`),
  KEY `emp_id` (`emp_id`),
  CONSTRAINT `vehicle_ibfk_1` FOREIGN KEY (`emp_id`) REFERENCES `employee` (`emp_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle`
--

LOCK TABLES `vehicle` WRITE;
/*!40000 ALTER TABLE `vehicle` DISABLE KEYS */;
INSERT INTO `vehicle` VALUES (1,'TN10AB1234','Swift','Maruti','Car','Available',2),(2,'TN22XY5678','Innova','Toyota','SUV','Available',2),(3,'TN33JK9999','Activa','Honda','Bike','Available',3);
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
  PRIMARY KEY (`vehicle_id`,`available_from`),
  CONSTRAINT `vehicleavailability_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`vehicle_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicleavailability`
--

LOCK TABLES `vehicleavailability` WRITE;
/*!40000 ALTER TABLE `vehicleavailability` DISABLE KEYS */;
INSERT INTO `vehicleavailability` VALUES (1,'2025-10-15','2025-10-20','Available'),(2,'2025-10-19','2025-10-25','Available'),(3,'2025-10-13','2025-10-25','Available');
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

-- Dump completed on 2025-10-14 21:43:42
