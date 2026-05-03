/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.11.14-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: mela_verde_db
-- ------------------------------------------------------
-- Server version	10.11.14-MariaDB-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES
(1,'melaverde','mela@verde.it','$2b$10$qwFc1lfsFDgU0uB5WQ/NMeO26XFZZoDOMknw636DrR8pN04PzlPZK','2026-05-02 17:08:46');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `vibe` varchar(20) DEFAULT 'psy',
  `image_url` varchar(255) DEFAULT NULL,
  `external_link` varchar(255) DEFAULT NULL,
  `organizer` varchar(255) DEFAULT 'Mela Verde',
  `performer` varchar(255) DEFAULT 'Mela Verde',
  `eventStatus` varchar(50) DEFAULT 'EventScheduled',
  `endDate` date DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES
(4,'Fantasia 2026','2026-06-17','Badia Tedalda (AR)','Fantàsia Festival nasce come uno spazio libero, aperto e\r\ncondiviso, dove linguaggi musicali differenti si incontrano per creare\r\nun’unica grande vibrazione collettiva. Nei 4 stage troverete Tekno,\r\npsytrance, dub, reggae e live music! Ritmi, suoni e visioni che\r\nprovengono da mondi diversi ma parlano la stessa lingua: quella\r\ndella musica che unisce.','psy','/assets/events/2026_fantasia.webp','https://www.fantasiafestival.org/','Fantàsia','Melaverde','active','2026-06-21',0),
(5,'Essentia Medicine Festival 2026','2026-06-12','Parco Nazionale del Pollino, Laino Borgo (CS)','Sei giorni di connessione profonda immersi nel parco nazionale del pollino, tra musica, workshops, talks, terapie olistiche, cerimonie, ...','natural','/assets/events/essentia-medicine-festival-2026-1777758260155.webp','https://www.essentiafestival.org/','Essentia Festival','Melaverde','active','2026-06-17',0),
(6,'WAO Festival 2026','2026-08-09','Parco dei Sette Frati-Monte Peglia','Festival di musica elettronica, arte visionaria e benessere.','psy','/assets/events/2026_wao.webp','https://www.waofestival.it//','WAO Festival','Melaverde','active','2026-08-14',0),
(7,'Technicolor','2026-05-14','Pianeta Sonoro (RM)','Ad aprire il varco saranno Sibilla (@cecia_hecha) b2b Dolcezzasevera (@crz.moon), poi @walter.laureti, @djgrondo e @mondocaneee continueranno il flusso tra bassi e traiettorie oblique.\r\n\r\nOltre il suono le visioni di Nur VJ @karimaruzzi, il body painting di @melaverde_art e le letture astrali di @apotelesma.ta ','psy','/assets/events/20260515_technicolor.webp','https://www.instagram.com/technicolor.club/','Technicolor Club','Melaverde','active',NULL,0),
(8,'Technicolor','2026-04-02','Pianeta Sonoro (RM)','Da Milano, ospitiamo un collettivo che esplora i confini estremi del ritmo e della coscienza.\r\n\r\n@godugong\r\n@dimitribuyaka\r\n@mondocaneee\r\n@walter.laureti\r\n\r\ne come sempre, oltre il suono\r\n\r\n@melaverde_art bodypainting,\r\n@nur_vj visuals,\r\n@apotelesma.ta carta astrale','psy','/assets/events/20260304_technicolor.webp','https://www.instagram.com/technicolor.club/','Technicolor Club','Melaverde','active',NULL,0),
(9,'Essentia Medicine Festival 2025','2025-06-24','Parco Nazionale del Pollino, Laino Borgo (CS)','Tantissimi workshop, conferenze, concerti live e hybrid dj set con artisti straordinari, performances, ecstatic dance, area healing, aree relax, yoga, massaggi, mercatini artigianali, fuoco sacro, piscina, spiaggia sul fiume, food truck vegetariani, area bimbi, area camper, camping e tanto altro. Sarà un festival trasformativo e indimenticabile! ','natural','/assets/events/2025_essentia_medicine_festival.webp','https://essentiafestival.com','Essentia Medicine Festival','Melaverde','active','2025-06-29',0),
(10,'One day in Rome - Fantasia Teaser Party','2026-05-02','Città dell Altra Economia (RM)','TEASER PARTY One Day in Roma del Fantasìa Festival ripropone un esperienza simile ma ridotta nel tempo e nello spazio una nostra sintesi di quello che troverete al Festival Fantasia 2026\r\nun’esperienza collettiva, immersiva e vibrante.','psy','/assets/events/20260502_teaser_party_fantasia.webp','https://www.instagram.com/fusion.circus/','Fusion Circus, Fantasia, Roma Vegan Festival','Melaverde','active',NULL,0),
(11,'WAO Festival','2025-08-12','Strada Statale 317 KM 8,300 San Venanzo 05010','Sei giorni di musica elettronica, 2 stage, più di 100 dj da tutto il mondo e una programma che conta oltre 40 attività tra workshops e laboratori.','psy','/assets/events/wao_festival_logo.webp','https://www.waofestival.it//','Melaverde','Melaverde','active','1925-08-16',0),
(12,'SMC PLAY NIGHT NECTAR','2026-02-07','SM Club, via Bencivenga 1 (RM)','Sul palco prenderá forma un rituale di sovranità corporea: la materia, il colore, possessione di sé. Rinascita e stasi.\r\n\r\nNon vi resta che scoprire di più...','bdsm','/assets/events/20260207-smc-play-night-nectar.webp','https://www.instagram.com/sm_club_roma/','Melaverde','Melaverde','active',NULL,0),
(13,'Festa Galattika','2025-08-28','Área de Lazer de Ancede (Porto area)','This project combines performance art, ritual painting, and musical interpretation to explore themes of love and connection. Inspired by the resilient and vibrant Calypte Anna hummingbird, the performance intertwines music and painting to tell the story of a poetic love encounter. ','natural','/assets/events/2025-festa-galattika.webp','https://www.instagram.com/festa_galattica_/','Melaverde','Melaverde','active','2025-09-01',1);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_url` varchar(255) NOT NULL,
  `vibe` enum('natural','psy','bdsm') NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `alt_text` text DEFAULT NULL,
  `type` enum('image','video') DEFAULT 'image',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
INSERT INTO `gallery` VALUES
(3,'/assets/gallery/psy_1777769517332.webp','psy','2026-05-03 00:52:05',NULL,'image'),
(4,'/assets/gallery/psy_1777769517182.webp','psy','2026-05-03 00:52:06',NULL,'image'),
(8,'/assets/gallery/natural_1777770495186.webp','natural','2026-05-03 01:08:17',NULL,'image'),
(9,'/assets/gallery/natural_1777772524104.webp','natural','2026-05-03 01:42:14',NULL,'image');
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_stats`
--

DROP TABLE IF EXISTS `site_stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_name` varchar(255) DEFAULT 'home',
  `visit_count` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_stats`
--

LOCK TABLES `site_stats` WRITE;
/*!40000 ALTER TABLE `site_stats` DISABLE KEYS */;
INSERT INTO `site_stats` VALUES
(1,'home',0);
/*!40000 ALTER TABLE `site_stats` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-03 11:42:01
