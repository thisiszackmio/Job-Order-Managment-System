-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 30, 2026 at 03:03 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jlms_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcement`
--

CREATE TABLE `announcement` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `date_of_request` date NOT NULL,
  `details` varchar(1000) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcement`
--

INSERT INTO `announcement` (`id`, `date_of_request`, `details`, `created_at`, `updated_at`) VALUES
(11, '2025-12-23', 'Hello, Love, JOMS, Hahaha', '2025-12-23 03:01:51', '2025-12-23 06:07:32');

-- --------------------------------------------------------

--
-- Table structure for table `assign_personnel`
--

CREATE TABLE `assign_personnel` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `personnel_id` smallint(6) NOT NULL,
  `personnel_name` varchar(255) NOT NULL,
  `assignment` varchar(500) NOT NULL,
  `status` int(11) NOT NULL,
  `date_assigned` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `assign_personnel`
--

INSERT INTO `assign_personnel` (`id`, `personnel_id`, `personnel_name`, `assignment`, `status`, `date_assigned`, `created_at`, `updated_at`) VALUES
(4, 43, 'Jan Dexter T. Loang', 'Driver/Mechanic', 0, NULL, '2024-09-26 08:40:49', '2026-05-12 01:00:48'),
(5, 44, 'Joel A. Magno', 'Driver/Mechanic', 0, NULL, '2024-09-26 08:41:16', '2026-05-09 04:01:28'),
(6, 68, 'Daryl T. Sumanoy', 'Driver/Mechanic', 0, NULL, '2024-09-26 08:41:41', '2026-05-09 04:03:22'),
(8, 50, 'Edward Sonny B. Namindang', 'IT Service', 0, NULL, '2024-09-26 08:42:12', '2024-09-26 08:42:12'),
(9, 1, 'Zack-Mio A. Sermon', 'IT Service', 0, NULL, '2024-10-01 05:49:02', '2024-10-01 05:49:02'),
(21, 27, 'Janrey Vincent P. Durano', 'Driver/Mechanic', 0, NULL, '2025-09-18 01:48:29', '2026-04-03 04:38:36'),
(22, 25, 'Edgardo B. Dandoy', 'Watering Services', 0, NULL, '2025-09-25 00:39:46', '2025-12-20 05:49:10'),
(23, 29, 'Kate Wendell A. Eugenio', 'Janitorial Service', 0, NULL, '2025-09-25 00:40:29', '2025-09-25 00:40:29'),
(24, 21, 'Luis A. Calderon', 'Driver/Mechanic', 0, NULL, '2025-10-30 01:46:13', '2026-04-03 05:38:43'),
(28, 37, 'Mark Anthony C. Gonzales', 'Driver/Mechanic', 0, NULL, '2026-01-14 07:08:33', '2026-05-26 05:50:23'),
(32, 1, 'Zack-Mio A. Sermon', 'Driver/Mechanic', 3, NULL, '2026-03-31 03:50:35', '2026-04-28 01:28:12'),
(35, 25, 'Edgardo B. Dandoy', 'Driver/Mechanic', 0, NULL, '2026-03-31 03:53:37', '2026-04-03 04:35:22'),
(36, 12, 'Clint Bryan B. Balmores', 'Driver/Mechanic', 0, NULL, '2026-03-31 03:58:00', '2026-04-03 04:36:32'),
(38, 20, 'Colin Kay R. Cajote', 'Engeneering Services', 0, NULL, '2026-04-07 00:50:09', '2026-04-07 00:50:09'),
(39, 34, 'Richie Aram B. Garganera', 'Janitorial Service', 0, NULL, '2026-04-07 00:55:23', '2026-04-07 00:55:23'),
(43, 12, 'Clint Bryan B. Balmores', 'Janitorial Service', 0, NULL, '2026-04-07 01:01:10', '2026-04-07 01:01:10'),
(44, 38, 'Cris Ian R. Jacinto', 'Janitorial Service', 0, NULL, '2026-04-07 01:01:58', '2026-04-07 01:01:58');

-- --------------------------------------------------------

--
-- Table structure for table `form_request_tracker`
--

CREATE TABLE `form_request_tracker` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `form_id` int(11) NOT NULL,
  `type_of_request` varchar(255) NOT NULL,
  `remarks` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `form_request_tracker`
--

INSERT INTO `form_request_tracker` (`id`, `form_id`, `type_of_request`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 1, 'Vehicle', 'Zack-Mio A. Sermon submitted a request.', '2026-05-09 01:36:12', '2026-05-09 01:36:12'),
(2, 1, 'Vehicle', 'Zack-Mio A. Sermon has canceled the form.', '2026-05-09 01:44:33', '2026-05-09 01:44:33'),
(3, 2, 'Vehicle', 'Zack-Mio A. Sermon submitted a request.', '2026-05-09 01:45:47', '2026-05-09 01:45:47'),
(4, 2, 'Vehicle', 'Zack-Mio A. Sermon updated the form.', '2026-05-09 01:53:12', '2026-05-09 01:53:12'),
(5, 2, 'Vehicle', 'Sue Christine A. Sade has assigned the driver and vehicle.', '2026-05-09 02:22:57', '2026-05-09 02:22:57'),
(6, 2, 'Vehicle', 'Naomie D. Zalsos approved the request.', '2026-05-09 02:33:44', '2026-05-09 02:33:44'),
(7, 2, 'Vehicle', 'Zack-Mio A. Sermon updated the form.', '2026-05-09 04:03:22', '2026-05-09 04:03:22'),
(8, 3, 'Vehicle', 'Sue Christine A. Sade submitted a request.', '2026-05-09 05:20:54', '2026-05-09 05:20:54'),
(9, 3, 'Vehicle', 'Sue Christine A. Sade updated the form.', '2026-05-09 05:39:04', '2026-05-09 05:39:04'),
(10, 3, 'Vehicle', 'Arthur B. Nogas approved the request.', '2026-05-09 06:02:53', '2026-05-09 06:02:53'),
(11, 4, 'Vehicle', 'Dennis S. Cambaya submitted a request.', '2026-05-09 06:09:04', '2026-05-09 06:09:04'),
(12, 4, 'Vehicle', 'Sue Christine A. Sade has assigned the driver and vehicle.', '2026-05-09 06:16:48', '2026-05-09 06:16:48'),
(13, 4, 'Vehicle', 'Arthur B. Nogas disapproved the request.', '2026-05-09 06:26:39', '2026-05-09 06:26:39'),
(14, 50, 'Repair', 'Zack-Mio A. Sermon submitted a request.', '2026-05-12 08:30:12', '2026-05-12 08:30:12'),
(15, 50, 'Repair', 'Sheila Andrea R. Bollozos disapproved the request.', '2026-05-13 01:03:26', '2026-05-13 01:03:26'),
(16, 16, 'Facility/Venue', 'The form was closed by the system.', '2026-05-13 02:57:20', '2026-05-13 02:57:20'),
(17, 2, 'Vehicle', 'The form was closed by the system.', '2026-05-13 03:16:30', '2026-05-13 03:16:30'),
(18, 51, 'Repair', 'Zack-Mio A. Sermon submitted a request.', '2026-05-22 02:19:12', '2026-05-22 02:19:12'),
(19, 51, 'Repair', 'Zack-Mio A. Sermon cancel the request.', '2026-05-22 02:20:03', '2026-05-22 02:20:03'),
(20, 52, 'Repair', 'Dennis S. Cambaya submitted a request.', '2026-05-22 02:32:18', '2026-05-22 02:32:18'),
(21, 52, 'Repair', 'Dennis S. Cambaya updated the part A form.', '2026-05-22 02:34:09', '2026-05-22 02:34:09'),
(22, 52, 'Repair', 'Dennis S. Cambaya cancel the request.', '2026-05-22 02:41:35', '2026-05-22 02:41:35'),
(23, 53, 'Repair', 'Dennis S. Cambaya submitted a request.', '2026-05-22 02:42:58', '2026-05-22 02:42:58'),
(24, 53, 'Repair', 'Joel B. Escala disapproved the request.', '2026-05-22 02:45:50', '2026-05-22 02:45:50'),
(25, 54, 'Repair', 'Dennis S. Cambaya submitted a request.', '2026-05-22 02:47:05', '2026-05-22 02:47:05'),
(26, 54, 'Repair', 'Dennis S. Cambaya updated the part A form.', '2026-05-22 02:49:00', '2026-05-22 02:49:00'),
(27, 54, 'Repair', 'Joel B. Escala approved the request.', '2026-05-22 03:01:14', '2026-05-22 03:01:14'),
(28, 54, 'Repair', 'Sue Christine A. Sade updated the part A form.', '2026-05-22 03:04:43', '2026-05-22 03:04:43'),
(29, 54, 'Repair', 'Sue Christine A. Sade filled out Part B form.', '2026-05-22 03:06:16', '2026-05-22 03:06:16'),
(30, 54, 'Repair', 'Sue Christine A. Sade updated the part B form.', '2026-05-22 03:07:00', '2026-05-22 03:07:00'),
(31, 54, 'Repair', 'Naomie D. Zalsos approved the request.', '2026-05-22 03:10:19', '2026-05-22 03:10:19'),
(32, 54, 'Repair', 'Zack-Mio A. Sermon filled out Part C form.', '2026-05-22 03:21:17', '2026-05-22 03:21:17'),
(33, 54, 'Repair', 'Zack-Mio A. Sermon updated the part C form.', '2026-05-22 03:21:36', '2026-05-22 03:21:36'),
(34, 54, 'Repair', 'Zack-Mio A. Sermon filled out Part D form.', '2026-05-22 03:36:05', '2026-05-22 03:36:05'),
(35, 55, 'Repair', 'Cheryl C. Saluta submitted a request.', '2026-05-22 03:40:09', '2026-05-22 03:40:09'),
(36, 55, 'Repair', 'Sue Christine A. Sade filled out Part B form.', '2026-05-22 03:54:12', '2026-05-22 03:54:12'),
(37, 55, 'Repair', 'Naomie D. Zalsos approved the request.', '2026-05-22 03:55:55', '2026-05-22 03:55:55'),
(38, 56, 'Repair', 'Arthur B. Nogas submitted a request.', '2026-05-22 03:58:34', '2026-05-22 03:58:34'),
(39, 56, 'Repair', 'Sue Christine A. Sade filled out Part B form.', '2026-05-22 04:03:47', '2026-05-22 04:03:47'),
(40, 56, 'Repair', 'Naomie D. Zalsos approved the request.', '2026-05-22 04:05:20', '2026-05-22 04:05:20'),
(41, 5, 'Vehicle', 'Zack-Mio A. Sermon submitted a request.', '2026-05-26 05:43:24', '2026-05-26 05:43:24'),
(42, 5, 'Vehicle', 'Joan G. Bongcawel has assigned the driver and vehicle.', '2026-05-26 05:50:27', '2026-05-26 05:50:27');

-- --------------------------------------------------------

--
-- Table structure for table `joms_facility_venue`
--

CREATE TABLE `joms_facility_venue` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `request_office` varchar(255) NOT NULL,
  `title_of_activity` varchar(255) NOT NULL,
  `date_start` date NOT NULL,
  `time_start` time NOT NULL,
  `date_end` date NOT NULL,
  `time_end` time NOT NULL,
  `mph` tinyint(1) NOT NULL DEFAULT 0,
  `conference` tinyint(1) NOT NULL DEFAULT 0,
  `dorm` tinyint(1) NOT NULL DEFAULT 0,
  `other` tinyint(1) NOT NULL DEFAULT 0,
  `table` tinyint(1) NOT NULL DEFAULT 0,
  `no_table` int(11) DEFAULT NULL,
  `chair` tinyint(1) NOT NULL DEFAULT 0,
  `no_chair` int(11) DEFAULT NULL,
  `microphone` tinyint(1) NOT NULL DEFAULT 0,
  `no_microphone` int(11) DEFAULT NULL,
  `others` tinyint(1) NOT NULL DEFAULT 0,
  `specify` varchar(500) DEFAULT NULL,
  `projector` tinyint(1) NOT NULL DEFAULT 0,
  `projector_screen` tinyint(1) NOT NULL DEFAULT 0,
  `document_camera` tinyint(1) NOT NULL DEFAULT 0,
  `laptop` tinyint(1) NOT NULL DEFAULT 0,
  `television` tinyint(1) NOT NULL DEFAULT 0,
  `sound_system` tinyint(1) NOT NULL DEFAULT 0,
  `videoke` tinyint(1) NOT NULL DEFAULT 0,
  `name_male` varchar(1000) DEFAULT NULL,
  `name_female` varchar(1000) DEFAULT NULL,
  `other_details` varchar(255) DEFAULT NULL,
  `admin_approval` tinyint(1) NOT NULL DEFAULT 0,
  `date_approve` date DEFAULT NULL,
  `obr_instruct` varchar(255) DEFAULT NULL,
  `obr_comment` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `joms_facility_venue`
--

INSERT INTO `joms_facility_venue` (`id`, `user_id`, `user_name`, `request_office`, `title_of_activity`, `date_start`, `time_start`, `date_end`, `time_end`, `mph`, `conference`, `dorm`, `other`, `table`, `no_table`, `chair`, `no_chair`, `microphone`, `no_microphone`, `others`, `specify`, `projector`, `projector_screen`, `document_camera`, `laptop`, `television`, `sound_system`, `videoke`, `name_male`, `name_female`, `other_details`, `admin_approval`, `date_approve`, `obr_instruct`, `obr_comment`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 1, 'Zack-Mio A. Sermon', 'Admin', 'Berthing Meeting', '2025-10-24', '08:00:00', '2025-10-24', '16:00:00', 1, 0, 0, 0, 1, NULL, 1, NULL, 1, NULL, 0, NULL, 1, 0, 0, 1, 0, 0, 0, NULL, NULL, NULL, 1, '2025-10-24', 'Test Here', 'Test Here II', 'Form is closed', '2025-10-23 06:06:29', '2025-10-27 01:12:29'),
(2, 9, 'Sue Christine A. Sade', 'PSD', 'Berthing Meeting', '2025-10-27', '10:00:00', '2025-10-27', '12:00:00', 0, 1, 0, 0, 1, NULL, 1, NULL, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'Sue Christine A. Sade canceled the form request.', '2025-10-24 07:48:31', '2025-10-27 01:14:27'),
(3, 9, 'Sue Christine A. Sade', 'Admin', 'Audit Meeting', '2025-10-27', '13:00:00', '2025-10-27', '15:00:00', 0, 1, 0, 0, 1, NULL, 1, NULL, 0, NULL, 1, 'Snacks', 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, 1, '2025-10-27', 'Please ko Sue', 'Copy Maam', 'Form is closed', '2025-10-27 01:18:44', '2025-10-30 02:55:27'),
(4, 76, 'Naomie D. Zalsos', 'Admin', 'General Orientation', '2025-10-28', '13:00:00', '2025-10-28', '15:30:00', 1, 0, 0, 0, 1, NULL, 1, NULL, 1, NULL, 0, NULL, 0, 0, 1, 0, 0, 0, 0, NULL, NULL, NULL, 1, '2025-10-27', 'Please ko facilitate Sue, Thanks', 'Okay maam', 'Form is closed', '2025-10-27 02:23:06', '2025-10-30 02:55:35'),
(5, 1, 'Zack-Mio A. Sermon', 'Admin', 'Berthing Meeting', '2025-11-13', '10:00:00', '2025-11-13', '13:00:00', 1, 0, 0, 0, 1, NULL, 1, NULL, 1, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'Zack-Mio A. Sermon canceled the form request.', '2025-11-12 06:46:05', '2025-11-12 06:54:36'),
(6, 19, 'Joan G. Bongcawel', 'Admin', 'General Assembley', '2025-11-13', '09:00:00', '2025-11-13', '12:00:00', 1, 0, 0, 0, 1, NULL, 1, NULL, 0, NULL, 0, NULL, 1, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'Joan G. Bongcawel canceled the form request.', '2025-11-12 07:06:42', '2025-11-13 01:09:38'),
(7, 19, 'Joan G. Bongcawel', 'Admin', 'General Meeting 2025', '2025-11-18', '08:00:00', '2025-11-18', '17:00:00', 1, 0, 0, 0, 1, NULL, 1, NULL, 1, NULL, 0, NULL, 0, 0, 0, 1, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'Joan G. Bongcawel canceled the form request.', '2025-11-13 01:15:01', '2025-11-15 03:10:20'),
(8, 19, 'Joan G. Bongcawel', 'Admin', 'Overnight Stay', '2025-11-17', '08:00:00', '2025-11-21', '12:00:00', 0, 0, 1, 0, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 'John A. Doe', 'Jane A. Doe', NULL, 0, NULL, NULL, NULL, 'Joan G. Bongcawel canceled the form request.', '2025-11-15 03:12:03', '2025-11-15 03:12:42'),
(9, 19, 'Joan G. Bongcawel', 'Admin', 'Meeting (basta meeting)', '2025-11-17', '08:00:00', '2025-11-17', '17:00:00', 0, 1, 0, 0, 1, NULL, 1, NULL, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'Joan G. Bongcawel canceled the form request.', '2025-11-15 03:14:38', '2025-11-15 03:15:20'),
(10, 1, 'Zack-Mio A. Sermon', 'Admin', 'Division Manager\'s Meeting', '2025-12-02', '08:00:00', '2025-12-02', '12:00:00', 0, 1, 0, 0, 1, NULL, 1, NULL, 1, NULL, 0, NULL, 1, 0, 0, 1, 0, 0, 0, NULL, NULL, NULL, 4, '2025-12-01', NULL, NULL, 'Disapproved (Reason: Ganahan lang ko)', '2025-11-29 07:04:51', '2025-12-01 02:57:12'),
(11, 1, 'Zack-Mio A. Sermon', 'Admin', 'HO QMS', '2025-12-01', '10:00:00', '2025-12-05', '08:00:00', 0, 0, 1, 0, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 'Miguel Santos\nJohn Dela Cruz', 'Maria Lopez\nAngela Bautista', 'Serve Foods everyday', 1, '2025-12-01', 'Please ko Sue', 'Test', 'Form is closed', '2025-12-01 00:54:04', '2026-04-22 03:46:35'),
(12, 1, 'Zack-Mio A. Sermon', 'Admin', 'Berthing Meeting', '2026-03-11', '08:00:00', '2026-03-11', '17:00:00', 1, 0, 0, 0, 1, NULL, 1, NULL, 1, NULL, 0, NULL, 0, 0, 0, 0, 1, 0, 0, NULL, NULL, NULL, 7, NULL, NULL, NULL, 'Waiting for admin manager\'s approval.', '2026-03-10 05:26:03', '2026-03-10 05:26:03'),
(13, 1, 'Zack-Mio A. Sermon', 'Admin', 'Berthing Meeting 2025', '2026-03-20', '08:00:00', '2026-03-21', '17:00:00', 1, 0, 0, 0, 1, NULL, 1, 80, 1, NULL, 0, NULL, 0, 0, 1, 0, 0, 0, 0, NULL, NULL, NULL, 2, '2026-03-20', 'Please ko ani Sue', 'Noted Maam Nao, I assign IT for this and also for the snacks and also documents.', 'The Admin Manager has approved this request.', '2026-03-19 02:52:14', '2026-03-20 03:40:06'),
(14, 1, 'Zack-Mio A. Sermon', 'Admin', 'Berthing Meeting', '2026-03-20', '15:00:00', '2026-03-20', '17:00:00', 0, 1, 0, 0, 1, NULL, 0, NULL, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'Zack-Mio A. Sermon canceled the form request.', '2026-03-20 05:25:32', '2026-03-20 05:39:08'),
(15, 1, 'Zack-Mio A. Sermon', 'Admin', 'Berthing Meeting', '2026-03-21', '06:00:00', '2026-03-21', '12:00:00', 0, 1, 0, 0, 1, NULL, 1, NULL, 1, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, 4, '2026-03-20', NULL, NULL, 'Disapproved (Reason: Wala lang, ganahan lang ko)', '2026-03-20 05:46:27', '2026-03-20 06:48:53'),
(16, 1, 'Zack-Mio A. Sermon', 'Admin', 'Berthing Meeting II', '2026-04-23', '08:00:00', '2026-04-23', '22:00:00', 0, 1, 0, 0, 1, NULL, 1, NULL, 1, NULL, 0, NULL, 0, 0, 0, 1, 1, 0, 0, NULL, NULL, NULL, 1, '2026-04-22', 'This is test only Haha, huhu', 'This is test ha? Huhu, hehehe,', 'Form is closed', '2026-04-16 03:01:03', '2026-05-13 02:57:20'),
(17, 1, 'Zack-Mio A. Sermon', 'Admin', 'Berthing Meeting II', '2026-04-23', '10:00:00', '2026-04-23', '12:00:00', 1, 0, 0, 0, 1, 3, 1, 80, 1, 5, 0, NULL, 0, 0, 1, 0, 0, 0, 0, NULL, NULL, NULL, 2, '2026-04-22', 'This is test only', 'This is noted maam Nao', 'The Admin Manager has approved this request.', '2026-04-22 06:00:54', '2026-04-22 07:04:07'),
(18, 1, 'Zack-Mio A. Sermon', 'Admin', 'Berthing Meeting II', '2026-04-24', '20:00:00', '2026-04-25', '12:00:00', 0, 0, 1, 0, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, 'Zack-Mio A. Sermon', NULL, 'Breakfast only', 4, '2026-04-22', NULL, NULL, 'Disapproved (Reason: ganahan lang ko)', '2026-04-22 07:05:36', '2026-04-22 07:29:48'),
(19, 1, 'Zack-Mio A. Sermon', 'Admin', 'Berthing Meeting II', '2026-04-27', '10:00:00', '2026-04-27', '12:00:00', 1, 0, 0, 0, 1, NULL, 1, NULL, 0, NULL, 0, NULL, 0, 0, 0, 1, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'Zack-Mio A. Sermon canceled the form request.', '2026-04-22 07:30:40', '2026-04-22 07:32:39'),
(20, 76, 'Naomie D. Zalsos', 'Admin', 'Berthing Meeting II', '2026-04-24', '13:00:00', '2026-04-24', '17:00:00', 1, 0, 0, 0, 1, NULL, 1, NULL, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, 6, '2026-04-23', 'Please so Sue', NULL, 'The Admin Manager has submit the request.', '2026-04-23 01:10:28', '2026-04-23 01:10:28'),
(21, 1, 'Zack-Mio A. Sermon', 'Admin', 'Berthing Meeting II', '2026-04-30', '14:00:00', '2026-04-30', '17:00:00', 0, 1, 0, 0, 1, NULL, 1, NULL, 1, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 1, NULL, NULL, NULL, 4, '2026-04-30', NULL, NULL, 'Disapproved (Reason: Ganahan lang ko)', '2026-04-30 00:33:14', '2026-04-30 00:55:47'),
(22, 1, 'Zack-Mio A. Sermon', 'Admin', 'Berthing Meeting II', '2026-04-30', '15:00:00', '2026-04-30', '17:00:00', 0, 1, 0, 0, 1, NULL, 1, NULL, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, 0, NULL, NULL, NULL, 'Zack-Mio A. Sermon canceled the form request.', '2026-04-30 01:00:37', '2026-04-30 01:01:11');

-- --------------------------------------------------------

--
-- Table structure for table `joms_inspection_form`
--

CREATE TABLE `joms_inspection_form` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `property_number` varchar(255) DEFAULT NULL,
  `acquisition_date` date DEFAULT NULL,
  `acquisition_cost` varchar(255) DEFAULT NULL,
  `brand_model` varchar(255) DEFAULT NULL,
  `serial_engine_no` varchar(255) DEFAULT NULL,
  `type_of_property` varchar(255) NOT NULL,
  `property_description` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `complain` varchar(500) NOT NULL,
  `date_of_filling` date DEFAULT NULL,
  `date_of_last_repair` date DEFAULT NULL,
  `nature_of_last_repair` varchar(255) DEFAULT NULL,
  `before_repair_date` date DEFAULT NULL,
  `after_reapir_date` date DEFAULT NULL,
  `findings` varchar(500) DEFAULT NULL,
  `recommendations` varchar(500) DEFAULT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `supervisor_id` smallint(6) NOT NULL,
  `supervisor_name` varchar(255) NOT NULL,
  `personnel_id` smallint(6) DEFAULT NULL,
  `personnel_name` varchar(255) DEFAULT NULL,
  `form_status` tinyint(1) NOT NULL DEFAULT 0,
  `form_remarks` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `joms_inspection_form`
--

INSERT INTO `joms_inspection_form` (`id`, `user_id`, `user_name`, `property_number`, `acquisition_date`, `acquisition_cost`, `brand_model`, `serial_engine_no`, `type_of_property`, `property_description`, `location`, `complain`, `date_of_filling`, `date_of_last_repair`, `nature_of_last_repair`, `before_repair_date`, `after_reapir_date`, `findings`, `recommendations`, `remarks`, `supervisor_id`, `supervisor_name`, `personnel_id`, `personnel_name`, `form_status`, `form_remarks`, `created_at`, `updated_at`) VALUES
(1, 22, 'Dennis S. Cambaya', '12344567', '2025-09-29', '20000', 'DHI-XVR5116H-4KL', 'LTDFEF34234FFDF', 'IT Equipment & Related Materials', 'This is test only', 'ESD', 'Test lang ko kay ganahan man ko walay kay mabuhat', '2025-10-20', '2025-10-08', 'Test', '2025-10-20', '2025-10-20', 'Test', 'Test', 'Test Here', 4, 'Joel B. Escala', 65, 'Jeffrey N. Silao', 1, 'Form is closed', '2025-10-20 05:04:54', '2025-10-21 02:05:16'),
(2, 22, 'Dennis S. Cambaya', '12344567', '2025-09-29', '20000', 'DHI-XVR5116H-4KL', '4HO2010PAZ245A6', 'IT Equipment & Related Materials', 'Printer', 'ESD', 'My printer was not working spill ink', '2025-10-21', NULL, NULL, '2025-10-21', '2025-10-21', 'Test', 'Test here', 'Test g', 4, 'Joel B. Escala', 65, 'Jeffrey N. Silao', 1, 'Form is closed', '2025-10-21 02:23:10', '2025-10-22 05:58:22'),
(3, 22, 'Dennis S. Cambaya', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test', 'Admin', 'Test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, 'Joel B. Escala', NULL, NULL, 0, 'Dennis S. Cambaya canceled the form request.', '2025-10-21 02:29:40', '2025-10-21 02:31:02'),
(4, 19, 'Joan G. Bongcawel', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test', 'Admin', 'Test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 7, 'Disapproved by the Supervisor (Reason: There is no issue).', '2025-10-22 02:33:29', '2025-10-22 02:41:34'),
(5, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'This is test only', 'Test', '2025-10-22', NULL, NULL, '2025-10-22', '2025-10-22', 'Test', 'Test', 'Test', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 1, 'Form is closed', '2025-10-22 03:15:50', '2025-11-06 03:02:49'),
(6, 76, 'Naomie D. Zalsos', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'Test Here', '2025-10-22', NULL, NULL, '2025-10-22', '2025-10-22', 'Test', 'Test', 'Test', 76, 'Naomie D. Zalsos', 1, 'Zack-Mio A. Sermon', 1, 'Form is closed', '2025-10-22 05:47:46', '2025-11-06 03:03:11'),
(7, 2, 'Arthur B. Nogas', 'Laptop20200', '2025-10-09', '20000', 'wrwer', 'Test Serial Numbers', 'IT Equipment & Related Materials', 'Test', 'OPM', 'Test', '2025-10-22', NULL, NULL, '2025-10-22', '2025-10-22', 'Test', 'Test', 'Test', 2, 'Arthur B. Nogas', 65, 'Jeffrey N. Silao', 1, 'Form is closed', '2025-10-22 05:59:53', '2025-11-06 03:03:20'),
(8, 19, 'Joan G. Bongcawel', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'PC', 'Admin', 'My computer is so slow', '2025-10-22', NULL, NULL, '2025-10-22', '2025-10-22', 'Test', 'Test', 'Test', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 1, 'Form is closed', '2025-10-22 06:36:55', '2025-11-04 06:13:48'),
(9, 1, 'Zack-Mio A. Sermon', 'Laptop20200', '2025-05-08', '50000', 'DHI-XVR5116H-4KL', 'LTDFEF34234FFDF', 'IT Equipment & Related Materials', 'Laptop', 'Admin', 'My laptop not working hehehe', '2025-11-04', '2025-10-30', 'Test Here', '2025-11-04', '2025-11-05', 'Test III', 'Test III', 'Test III', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 2, 'The assigned personnel has completed the form.', '2025-11-04 05:50:51', '2025-11-05 03:20:05'),
(10, 19, 'Joan G. Bongcawel', '12344567', '2025-10-28', '50000', 'DHI-XVR5116H-4KL', 'LTDFEF34234FFDF', 'IT Equipment & Related Materials', 'PC', 'Admin', 'My PC not working and also my printer', '2025-11-05', '2025-10-29', 'Test', '2025-11-05', '2025-11-05', 'Test III', 'Test', 'Test III', 18, 'Sheila Andrea R. Bollozos', 65, 'Jeffrey N. Silao', 2, 'The assigned personnel has completed the form.', '2025-11-05 03:26:15', '2025-11-05 05:19:13'),
(11, 1, 'Zack-Mio A. Sermon', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'This is test only Hehe', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 7, 'Disapproved by the Supervisor (Reason: Ganahan lang ko).', '2025-11-05 05:43:06', '2025-11-05 08:09:45'),
(12, 9, 'Sue Christine A. Sade', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'Test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 7, 'Disapproved by the Supervisor (Reason: Wala Lang).', '2025-11-05 05:49:15', '2025-11-05 08:17:27'),
(13, 22, 'Dennis S. Cambaya', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'ESD', 'Test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, 'Joel B. Escala', NULL, NULL, 0, 'Dennis S. Cambaya canceled the form request.', '2025-11-05 05:58:15', '2025-11-05 06:18:10'),
(14, 68, 'Daryl T. Sumanoy', 'Test Property Number', '2025-10-28', '100000', 'Test Brand/Model', 'Test Serial/Engine No', 'Vehicle Supplies & Materials', 'Test', 'Admin', 'Test only', '2025-11-05', NULL, NULL, '2025-11-05', '2025-11-05', 'Test I', 'Test II', 'Test III', 18, 'Sheila Andrea R. Bollozos', 68, 'Daryl T. Sumanoy', 4, 'This form was approved by the admin manager.', '2025-11-05 08:22:43', '2025-11-06 03:26:11'),
(15, 19, 'Joan G. Bongcawel', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'PC', 'Admin', 'Not working and also the mouse', '2025-11-06', '2023-04-02', 'Test here hahaha', '2025-11-06', '2025-11-06', 'Test II', 'Test', 'Test I', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 1, 'Form is closed', '2025-11-06 03:34:49', '2026-03-21 05:19:26'),
(16, 1, 'Zack-Mio A. Sermon', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'Test', '2025-11-06', NULL, NULL, '2025-11-06', '2025-11-06', 'Test', 'Test', 'test', 18, 'Sheila Andrea R. Bollozos', 65, 'Jeffrey N. Silao', 1, 'Form is closed', '2025-11-06 04:00:45', '2026-04-16 03:01:20'),
(17, 9, 'Sue Christine A. Sade', 'Test Property Number', '2025-10-29', '10000', 'DHI-XVR5116H-4KL', 'LTDFEF34234FFDF', 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'Test', '2025-11-06', NULL, NULL, '2025-11-06', '2025-11-06', 'Test', 'Test II', 'Test III', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 1, 'Form is closed', '2025-11-06 06:05:03', '2026-01-14 00:56:44'),
(18, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Laptop', 'Admin', 'Not Working', '2025-11-06', NULL, NULL, '2025-11-06', '2025-11-06', 'Test', 'Test', 'Test', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 2, 'The assigned personnel has completed the form.', '2025-11-06 08:27:47', '2025-11-07 01:48:59'),
(19, 1, 'Zack-Mio A. Sermon', 'Test Property Number', '2022-11-07', '20000', 'Test Brand Model', 'Test Serial Number', 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'Test', '2025-11-07', NULL, NULL, '2025-11-07', '2025-11-07', 'Test III', 'Test III', 'Test III', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 1, 'This form was approved by the admin manager.', '2025-11-07 01:55:04', '2025-12-27 02:29:48'),
(20, 19, 'Joan G. Bongcawel', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test', 'ESD', 'Test', '2025-11-07', NULL, NULL, '2025-11-07', '2025-11-07', 'Test', 'Test', 'Test', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 1, 'Form is closed', '2025-11-07 02:10:11', '2025-11-12 02:32:50'),
(21, 1, 'Zack-Mio A. Sermon', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'Test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 0, 'Sue Christine A. Sade canceled the form request.', '2025-11-12 02:42:31', '2025-12-27 01:55:43'),
(22, 19, 'Joan G. Bongcawel', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Printer', 'Admin', 'Test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 0, 'Joan G. Bongcawel canceled the form request.', '2025-11-13 06:07:13', '2025-11-13 06:07:38'),
(23, 1, 'Zack-Mio A. Sermon', 'Laptop2020', '2025-11-05', '50000', 'Test Brand Model', 'Test Serial Number', 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'Test here', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 0, 'Zack-Mio A. Sermon canceled the form request.', '2025-11-17 02:39:03', '2025-11-29 05:44:05'),
(24, 1, 'Zack-Mio A. Sermon', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Laptop', 'Admin', 'Slow performance', '2025-11-29', '2025-11-04', 'Test Here', '2025-11-29', '2025-11-29', 'Test', 'Test', 'Test', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 1, 'Form is closed', '2025-11-29 02:09:40', '2025-12-09 08:53:07'),
(26, 1, 'Zack-Mio A. Sermon', '12344567', '2025-12-03', '50000', 'DHI-XVR5116H-4KL', 'LTDFEF34234FFDF', 'IT Equipment & Related Materials', 'This is test only', 'Admin', 'This is test', '2025-12-27', '2025-12-04', 'This is test only', '2025-12-27', '2025-12-27', 'This is test II', 'This is test II', 'Test Here II', 18, 'Sheila Andrea R. Bollozos', 65, 'Jeffrey N. Silao', 1, 'Form is closed', '2025-12-27 01:49:29', '2026-01-05 06:11:27'),
(27, 9, 'Sue Christine A. Sade', NULL, NULL, NULL, NULL, NULL, 'Others', 'U', 'H', 'U', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 11, 'Waiting for supervisor approval.', '2026-01-14 02:03:17', '2026-01-14 02:03:17'),
(28, 9, 'Sue Christine A. Sade', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Tes', 'Tes', 'Tes', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 11, 'Waiting for supervisor approval.', '2026-01-14 02:07:47', '2026-01-14 02:07:47'),
(29, 22, 'Dennis S. Cambaya', 'Testing', '2023-01-10', '50000', 'Test', 'Test I', 'IT Equipment & Related Materials', 'Laptop', 'ESD', 'Test here', '2026-01-15', NULL, NULL, '2026-01-15', '2026-01-15', 'Test', 'Test I', 'Test I', 4, 'Joel B. Escala', 65, 'Jeffrey N. Silao', 1, 'Form is closed', '2026-01-15 02:27:34', '2026-01-20 01:52:50'),
(30, 79, 'Zackiee A. Sermon', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Laptop', 'Admin', 'Not charging and keyboard not working', '2026-01-20', '2026-01-09', 'Test', '2026-01-20', '2026-01-20', 'Test', 'Test', 'Test', 18, 'Sheila Andrea R. Bollozos', 65, 'Jeffrey N. Silao', 1, 'Form is closed', '2026-01-20 03:16:11', '2026-01-22 01:10:31'),
(31, 22, 'Dennis S. Cambaya', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Printer', 'ESD', 'Always paper JAM', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 7, 'Disapproved by the Supervisor (Reason: This request need for disposal).', '2026-01-20 04:12:14', '2026-01-20 05:55:02'),
(32, 1, 'Zack-Mio A. Sermon', '12344567', '2026-02-04', '50000', 'Test Brand Model', 'Test Serial Number', 'IT Equipment & Related Materials', 'Laptop', 'Test Location', 'test', '2026-02-21', '2026-02-10', 'This is test II', '2026-02-21', '2026-02-21', 'Test I', 'Test II', 'Test III', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 2, 'The assigned personnel has completed the form.', '2026-02-20 05:21:46', '2026-02-21 06:19:23'),
(33, 1, 'Zack-Mio A. Sermon', NULL, '2026-02-05', '50000', 'Test Brand Model', 'Test Serial Number', 'IT Equipment & Related Materials', 'This is test', 'Admin', 'Test only I', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 0, 'Sue Christine A. Sade canceled the form request.', '2026-02-21 06:20:19', '2026-02-23 05:29:19'),
(34, 22, 'Dennis S. Cambaya', 'Test Property Number', NULL, NULL, 'Test Brand Model', 'Test Serial Number', 'IT Equipment & Related Materials', 'Test Description', 'This is test only', 'Test only lang ni ha?', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, 'Joel B. Escala', NULL, NULL, 7, 'Disapproved by the Supervisor (Reason: Ganahan lang ko).', '2026-02-23 07:44:47', '2026-02-23 11:06:43'),
(35, 19, 'Joan G. Bongcawel', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'This is test only', 'This is test only and mao nato', '2026-02-23', '2026-02-03', 'Test', '2026-02-23', '2026-02-23', 'Test II', 'Test III', 'Test Here', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 1, 'Form is closed', '2026-02-23 11:16:14', '2026-02-25 00:07:20'),
(36, 1, 'Zack-Mio A. Sermon', '12344567', NULL, NULL, NULL, 'Test Serial Number', 'IT Equipment & Related Materials', 'Test Description', 'Tersfdhdgd', 'tsadfsdsd', '2026-02-27', '2026-03-03', 'Test Here', '2026-02-27', '2026-02-27', 'Test I', 'Test II', 'Heheheheeeeee', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 1, 'Form is closed', '2026-02-26 03:56:44', '2026-03-07 07:46:15'),
(37, 19, 'Joan G. Bongcawel', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Laptop', 'Admin', 'Test', '2026-02-27', NULL, NULL, '2026-02-27', '2026-02-27', 'Test I', 'Test I', 'Test III', 18, 'Sheila Andrea R. Bollozos', 65, 'Jeffrey N. Silao', 11, 'Waiting for supervisor approval.', '2026-02-27 02:20:08', '2026-02-27 02:38:02'),
(38, 1, 'Zack-Mio A. Sermon', 'Test Property Number', '2026-03-12', '50000', 'Test Brand Model', 'Test Serial Number', 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'Test', '2026-03-19', NULL, NULL, '2026-03-18', '2026-03-18', 'Test I', 'Test III', 'Test IIIiugg', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 1, 'Form is closed', '2026-03-18 06:04:55', '2026-04-15 01:00:37'),
(39, 1, 'Zack-Mio A. Sermon', 'Test Property Number', '2026-03-11', '50000', 'Test Brand Model', 'Test Serial Number', 'IT Equipment & Related Materials', 'Laptop', 'Admin', 'Test', '2026-03-19', NULL, 'Test', '2026-03-19', '2026-03-19', 'Test', 'Test II', 'Test I', 18, 'Sheila Andrea R. Bollozos', 50, 'Edward Sonny B. Namindang', 1, 'Form is closed', '2026-03-19 01:35:53', '2026-04-15 00:36:24'),
(40, 1, 'Zack-Mio A. Sermon', NULL, NULL, '10000', NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'Test Location', 'Wala lang test lang nako ni', '2026-03-19', NULL, NULL, '2026-03-19', '2026-03-19', 'Test', 'Test II', 'Test I', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 1, 'Form is closed', '2026-03-19 01:53:33', '2026-04-11 07:57:07'),
(41, 1, 'Zack-Mio A. Sermon', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'Test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 0, 'Zack-Mio A. Sermon canceled the form request.', '2026-03-20 06:55:15', '2026-03-20 06:58:25'),
(42, 1, 'Zack-Mio A. Sermon', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'Test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 7, 'Disapproved by the Supervisor (Reason: Ganahan lang ko).', '2026-03-20 06:58:56', '2026-03-20 08:15:28'),
(43, 1, 'Zack-Mio A. Sermon', NULL, NULL, NULL, NULL, NULL, 'Vehicle Supplies & Materials', 'Test Description', 'Test Location', 'Test', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 0, 'Zack-Mio A. Sermon canceled the form request.', '2026-03-20 08:15:59', '2026-03-20 08:34:00'),
(44, 1, 'Zack-Mio A. Sermon', '123445670', '2025-10-29', '50000', 'DHI-XVR5116H-4KL0', 'LTDFEF34234FFDF0', 'IT Equipment & Related Materials', 'Test Here', 'Admin', 'This is test only', '2026-04-14', NULL, NULL, '2026-04-14', '2026-04-14', 'Test', 'Test II', 'Test I', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 4, 'This form was approved by the admin manager.', '2026-04-10 09:31:34', '2026-04-14 07:19:33'),
(45, 1, 'Zack-Mio A. Sermon', '123445678', '2023-06-27', '50000', 'DHI-XVR5116H-4KL8', 'LTDFEF34234FFDFH', 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'This is test only', '2026-04-12', '2026-03-10', 'This is test II', NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 4, 'This form was approved by the admin manager.', '2026-04-10 09:36:32', '2026-04-14 02:23:57'),
(46, 1, 'Zack-Mio A. Sermon', '12344567', '2022-06-14', '20000', 'Test Brand Model', 'LTDFEF34234FFDF', 'IT Equipment & Related Materials', 'Laptop', 'Admin', 'This is test only and mao nato', '2026-04-09', NULL, NULL, '2026-04-14', '2026-04-14', 'Test', 'Test II', 'Test', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 2, 'The assigned personnel has completed the form.', '2026-04-11 04:10:19', '2026-04-14 04:29:39'),
(47, 1, 'Zack-Mio A. Sermon', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Laptop', 'Admin', 'This is test only', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 0, 'Zack-Mio A. Sermon canceled the form request.', '2026-04-14 02:39:11', '2026-04-14 02:44:29'),
(48, 1, 'Zack-Mio A. Sermon', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Laptop', 'Admin', 'This is test only', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 7, 'Disapproved by the Supervisor (Reason: Ganahan lang ko).', '2026-04-14 02:44:01', '2026-04-14 03:02:50'),
(49, 1, 'Zack-Mio A. Sermon', 'Test Property Number', '2022-07-20', '50000', 'DHI-XVR5116H-4KL', 'LTDFEF34234FFDFr', 'IT Equipment & Related Materials', 'Laptop', 'Admin', 'Not working', '2026-04-14', NULL, 'Test', '2026-04-14', '2026-04-14', 'Test I', 'Test II', 'Hehehe', 18, 'Sheila Andrea R. Bollozos', 1, 'Zack-Mio A. Sermon', 1, 'Form is closed', '2026-04-14 07:38:02', '2026-04-16 04:00:14'),
(50, 1, 'Zack-Mio A. Sermon', 'Test Property Number', '2021-03-10', '50000', 'Test Brand Model', 'LTDFEF34234FFDF', 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'This is test only', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 18, 'Sheila Andrea R. Bollozos', NULL, NULL, 7, 'Disapproved by the Supervisor (Reason: Ganahan lang ko).', '2026-05-12 08:30:12', '2026-05-13 01:03:26'),
(51, 1, 'Zack-Mio A. Sermon', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'This is test only', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, 'Joel B. Escala', NULL, NULL, 0, 'Zack-Mio A. Sermon canceled the form request.', '2026-05-22 02:19:12', '2026-05-22 02:20:03'),
(52, 22, 'Dennis S. Cambaya', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'PC', 'Admin', 'Dili mu gana', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, 'Joel B. Escala', NULL, NULL, 0, 'Dennis S. Cambaya canceled the form request.', '2026-05-22 02:32:18', '2026-05-22 02:41:35'),
(53, 22, 'Dennis S. Cambaya', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'Admin', 'This is test only', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, 'Joel B. Escala', NULL, NULL, 7, 'Disapproved by the Supervisor (Reason: Wala lang ganahan ko).', '2026-05-22 02:42:58', '2026-05-22 02:45:50'),
(54, 22, 'Dennis S. Cambaya', 'Laptop20200', '2023-06-06', '50000', 'DHI-XVR5116H-4KL', 'LTDFEF34234FFDF', 'IT Equipment & Related Materials', 'PC', 'Admin', 'Na guba akong PC', '2026-05-22', '2026-05-01', 'Test here', '2026-05-22', '2026-05-22', 'Test II', 'Test IV', 'Test Here', 4, 'Joel B. Escala', 1, 'Zack-Mio A. Sermon', 2, 'The assigned personnel has completed the form.', '2026-05-22 02:47:05', '2026-05-22 03:36:05'),
(55, 6, 'Cheryl C. Saluta', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'This is test only', 'Test', '2026-05-22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 6, 'Cheryl C. Saluta', 1, 'Zack-Mio A. Sermon', 4, 'This form was approved by the admin manager.', '2026-05-22 03:40:09', '2026-05-22 03:55:55'),
(56, 2, 'Arthur B. Nogas', NULL, NULL, NULL, NULL, NULL, 'IT Equipment & Related Materials', 'Test Description', 'This is test only', 'Test', '2026-05-22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 'Arthur B. Nogas', 1, 'Zack-Mio A. Sermon', 4, 'This form was approved by the admin manager.', '2026-05-22 03:58:34', '2026-05-22 04:05:20');

-- --------------------------------------------------------

--
-- Table structure for table `joms_vehicle_slip_form`
--

CREATE TABLE `joms_vehicle_slip_form` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `type_of_slip` varchar(255) NOT NULL,
  `purpose` varchar(500) NOT NULL,
  `passengers` varchar(1000) NOT NULL,
  `place_visited` varchar(255) NOT NULL,
  `date_arrival` date NOT NULL,
  `time_arrival` time NOT NULL,
  `vehicle_type` varchar(255) DEFAULT NULL,
  `driver_id` int(11) DEFAULT NULL,
  `driver` varchar(255) DEFAULT NULL,
  `admin_approval` tinyint(1) NOT NULL DEFAULT 0,
  `remarks` varchar(500) NOT NULL,
  `notes` varchar(500) DEFAULT NULL,
  `recieved_datetime` datetime DEFAULT NULL,
  `recieved_by` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `joms_vehicle_slip_form`
--

INSERT INTO `joms_vehicle_slip_form` (`id`, `user_id`, `user_name`, `type_of_slip`, `purpose`, `passengers`, `place_visited`, `date_arrival`, `time_arrival`, `vehicle_type`, `driver_id`, `driver`, `admin_approval`, `remarks`, `notes`, `recieved_datetime`, `recieved_by`, `created_at`, `updated_at`) VALUES
(1, 1, 'Zack-Mio A. Sermon', 'within', 'Test here', 'None', 'Place', '2026-05-09', '17:00:00', NULL, NULL, NULL, 0, 'Zack-Mio A. Sermon has canceled this form.', NULL, NULL, NULL, '2026-05-09 01:36:12', '2026-05-09 01:44:33'),
(2, 1, 'Zack-Mio A. Sermon', 'within', 'Test Ride', 'Zack Mio A. Sermon\nJohn A. Doe', 'Iligan City', '2026-05-09', '17:00:00', 'Toyota Hi-Ace Commuter (SND 2265)', 43, 'Jan Dexter T. Loang', 1, 'Form is closed', NULL, NULL, NULL, '2026-05-09 01:45:47', '2026-05-13 03:16:30'),
(3, 9, 'Sue Christine A. Sade', 'outside', 'Test Purpose', 'Sue Christine Sade\nRaymart Ruelan', 'Tubod, Lanao Del Norte', '2026-05-12', '17:00:00', 'Toyota Hi-Lux/FX (131203)', 37, 'Mark Anthony C. Gonzales', 2, 'Approved by the Port Manager.', NULL, NULL, NULL, '2026-05-09 05:20:54', '2026-05-09 06:02:53'),
(4, 22, 'Dennis S. Cambaya', 'outside', 'Test here', 'None', 'Place', '2026-05-09', '22:00:00', 'Toyota Hi-Lux/FX (131203)', 44, 'Joel A. Magno', 3, 'Disapproved by the Port Manager (Reason: Ganahan lang ko)', NULL, NULL, NULL, '2026-05-09 06:09:04', '2026-05-09 06:26:39'),
(5, 1, 'Zack-Mio A. Sermon', 'within', 'Test here', 'None', 'Place', '2026-05-26', '17:00:00', 'Toyota Hi-Lux/FX (131203)', 43, 'Jan Dexter T. Loang', 4, 'Joan G. Bongcawel has assigned a vehicle and driver, and is waiting for the Admin Manager\'s approval.', NULL, NULL, NULL, '2026-05-26 05:43:24', '2026-05-26 05:50:27');

-- --------------------------------------------------------

--
-- Table structure for table `joms_vehicle_type`
--

CREATE TABLE `joms_vehicle_type` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `vehicle_name` varchar(255) NOT NULL,
  `vehicle_plate` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `date_used` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `joms_vehicle_type`
--

INSERT INTO `joms_vehicle_type` (`id`, `vehicle_name`, `vehicle_plate`, `status`, `date_used`, `created_at`, `updated_at`) VALUES
(1, 'Toyota Hi-Lux', 'SND 2290', 0, NULL, '2025-03-21 03:05:30', '2026-05-09 04:03:22'),
(2, 'Toyota Hi-Lux/FX', '131203', 0, NULL, '2025-03-21 03:06:28', '2026-05-26 05:50:23'),
(4, 'Mitsubishi Adventure', 'SLF 432', 3, NULL, '2025-04-07 00:51:29', '2025-12-04 05:46:44'),
(5, 'Toyota Hi-Ace', 'SAB 4362', 0, NULL, '2025-04-07 00:53:06', '2026-05-01 02:32:25'),
(10, 'Toyota Hi-Ace Commuter', 'SND 2265', 0, NULL, '2025-04-07 06:04:31', '2026-05-12 01:00:48');

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category` varchar(255) NOT NULL,
  `message` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `logs`
--

INSERT INTO `logs` (`id`, `category`, `message`, `created_at`, `updated_at`) VALUES
(1, 'USER', 'Zack-Mio A. Sermon updated Joel A. Magno\'s badge.', '2026-05-08 05:57:11', '2026-05-08 05:57:11'),
(2, 'USER', 'Zack-Mio A. Sermon updated Daryl T. Sumanoy\'s badge.', '2026-05-08 05:57:44', '2026-05-08 05:57:44'),
(4, 'USER', 'Dennis S. Cambaya has logged into the system using Edge.', '2026-05-08 06:03:24', '2026-05-08 06:03:24'),
(7, 'USER', 'Dennis S. Cambaya has logged out on the system.', '2026-05-08 08:55:40', '2026-05-08 08:55:40'),
(8, 'USER', 'Daryl T. Sumanoy has logged into the system using Edge.', '2026-05-08 08:55:59', '2026-05-08 08:55:59'),
(9, 'USER', 'Daryl T. Sumanoy has logged out on the system.', '2026-05-08 08:59:01', '2026-05-08 08:59:01'),
(10, 'USER', 'Joel A. Magno has logged into the system using Edge.', '2026-05-08 08:59:14', '2026-05-08 08:59:14'),
(15, 'USER', 'Sue Christine A. Sade has logged into the system using Chrome.', '2026-05-09 01:33:09', '2026-05-09 01:33:09'),
(16, 'FORM', 'Zack-Mio A. Sermon has submitted a Vehicle Slip request.', '2026-05-09 01:36:12', '2026-05-09 01:36:12'),
(17, 'FORM', 'Zack-Mio A. Sermon has canceled Zack-Mio A. Sermon\'s request on Vehicle Slip No.1.', '2026-05-09 01:44:33', '2026-05-09 01:44:33'),
(18, 'FORM', 'Zack-Mio A. Sermon has submitted a Vehicle Slip request.', '2026-05-09 01:45:47', '2026-05-09 01:45:47'),
(19, 'FORM', 'Zack-Mio A. Sermon has updated Zack-Mio A. Sermon\'s request on Vehicle Slip No.2.', '2026-05-09 01:53:12', '2026-05-09 01:53:12'),
(20, 'FORM', 'Sue Christine A. Sade has assigned a driver and vehicle to Zack-Mio A. Sermon\'s request on Vehicle Slip No.2.', '2026-05-09 02:22:57', '2026-05-09 02:22:57'),
(21, 'USER', 'Joel A. Magno has logged out on the system.', '2026-05-09 02:31:48', '2026-05-09 02:31:48'),
(22, 'USER', 'Naomie D. Zalsos has logged into the system using Edge.', '2026-05-09 02:32:00', '2026-05-09 02:32:00'),
(23, 'FORM', 'Naomie D. Zalsos has approved Zack-Mio A. Sermon\'s request on Vehicle Slip No.2.', '2026-05-09 02:33:44', '2026-05-09 02:33:44'),
(24, 'FORM', 'Zack-Mio A. Sermon has updated Zack-Mio A. Sermon\'s request on Vehicle Slip No.2.', '2026-05-09 04:03:22', '2026-05-09 04:03:22'),
(25, 'FORM', 'Sue Christine A. Sade has submitted a Vehicle Slip request.', '2026-05-09 05:20:54', '2026-05-09 05:20:54'),
(26, 'FORM', 'Sue Christine A. Sade has updated Sue Christine A. Sade\'s request on Vehicle Slip No.3.', '2026-05-09 05:39:04', '2026-05-09 05:39:04'),
(27, 'USER', 'Naomie D. Zalsos has logged out on the system.', '2026-05-09 05:40:25', '2026-05-09 05:40:25'),
(28, 'USER', 'Arthur B. Nogas has logged into the system using Edge.', '2026-05-09 05:40:31', '2026-05-09 05:40:31'),
(29, 'FORM', 'Arthur B. Nogas has approved Sue Christine A. Sade\'s request on Vehicle Slip No.3.', '2026-05-09 06:02:53', '2026-05-09 06:02:53'),
(30, 'USER', 'Sue Christine A. Sade has logged out on the system.', '2026-05-09 06:04:49', '2026-05-09 06:04:49'),
(31, 'USER', 'Dennis S. Cambaya has logged into the system using Chrome.', '2026-05-09 06:05:01', '2026-05-09 06:05:01'),
(32, 'FORM', 'Dennis S. Cambaya has submitted a Vehicle Slip request.', '2026-05-09 06:09:04', '2026-05-09 06:09:04'),
(33, 'USER', 'Dennis S. Cambaya has logged out on the system.', '2026-05-09 06:13:01', '2026-05-09 06:13:01'),
(34, 'USER', 'Sue Christine A. Sade has logged into the system using Chrome.', '2026-05-09 06:13:21', '2026-05-09 06:13:21'),
(35, 'FORM', 'Sue Christine A. Sade has assigned a driver and vehicle to Dennis S. Cambaya\'s request on Vehicle Slip No.4.', '2026-05-09 06:16:48', '2026-05-09 06:16:48'),
(36, 'FORM', 'Arthur B. Nogas has dispprove Dennis S. Cambaya\'s request on Vehicle Slip No.4.', '2026-05-09 06:26:39', '2026-05-09 06:26:39'),
(37, 'USER', 'Arthur B. Nogas has logged out on the system.', '2026-05-09 06:34:27', '2026-05-09 06:34:27'),
(38, 'USER', 'Sue Christine A. Sade has logged out on the system.', '2026-05-09 06:34:35', '2026-05-09 06:34:35'),
(39, 'USER', 'Sue Christine A. Sade has logged into the system using Chrome.', '2026-05-12 01:00:17', '2026-05-12 01:00:17'),
(40, 'USER', 'Sue Christine A. Sade has logged out on the system.', '2026-05-12 08:00:11', '2026-05-12 08:00:11'),
(41, 'USER', 'Sheila Andrea R. Bollozos has logged into the system using Chrome.', '2026-05-12 08:11:03', '2026-05-12 08:11:03'),
(42, 'FORM', 'Zack-Mio A. Sermon has submitted the request for Pre/Post Repair Inspection.', '2026-05-12 08:30:12', '2026-05-12 08:30:12'),
(43, 'INSP', 'Sheila Andrea R. Bollozos has disapproved the request on the Pre/Post Repair Inspection Form (Control No. 50).', '2026-05-13 01:03:26', '2026-05-13 01:03:26'),
(44, 'FORM', 'The system has closed the Facility / Venue Request Form (Control No. 16).', '2026-05-13 02:57:20', '2026-05-13 02:57:20'),
(45, 'FORM', 'The system has closed the Vehicle Slip No. 2', '2026-05-13 03:16:30', '2026-05-13 03:16:30'),
(46, 'USER', 'Sheila Andrea R. Bollozos has logged out on the system.', '2026-05-13 03:27:56', '2026-05-13 03:27:56'),
(47, 'USER', 'Zack-Mio A. Sermon has logged out on the system.', '2026-05-13 03:28:08', '2026-05-13 03:28:08'),
(48, 'USER', 'Zack-Mio A. Sermon has logged into the system using Chrome.', '2026-05-13 03:34:57', '2026-05-13 03:34:57'),
(49, 'USER', 'Zack-Mio A. Sermon has logged out on the system.', '2026-05-13 03:35:28', '2026-05-13 03:35:28'),
(50, 'USER', 'Zack-Mio A. Sermon has logged into the system using Chrome.', '2026-05-13 03:40:48', '2026-05-13 03:40:48'),
(51, 'USER', 'Juan M. Dela cruz was registered in the system by Zack-Mio A. Sermon.', '2026-05-13 08:01:39', '2026-05-13 08:01:39'),
(52, 'USER', 'Sue Christine A. Sade has logged into the system using Chrome.', '2026-05-14 02:44:51', '2026-05-14 02:44:51'),
(53, 'USER', 'Sue Christine A. Sade has logged out on the system.', '2026-05-14 02:52:37', '2026-05-14 02:52:37'),
(54, 'USER', 'Dennis S. Cambaya has logged into the system using Chrome.', '2026-05-14 02:52:49', '2026-05-14 02:52:49'),
(55, 'USER', 'Dennis S. Cambaya has logged out on the system.', '2026-05-14 05:20:59', '2026-05-14 05:20:59'),
(56, 'USER', 'Sue Christine A. Sade has logged into the system using Chrome.', '2026-05-14 06:06:25', '2026-05-14 06:06:25'),
(57, 'USER', 'Zack-Mio A. Sermon updated Arthur B. Nogas\'s details.', '2026-05-15 01:55:44', '2026-05-15 01:55:44'),
(58, 'USER', 'Sue Christine A. Sade has logged out on the system.', '2026-05-15 04:44:16', '2026-05-15 04:44:16'),
(59, 'USER', 'Dennis S. Cambaya has logged into the system using Chrome.', '2026-05-15 04:50:00', '2026-05-15 04:50:00'),
(60, 'USER', 'Dennis S. Cambaya has logged out on the system.', '2026-05-15 04:50:40', '2026-05-15 04:50:40'),
(61, 'USER', 'Zack-Mio A. Sermon updated Sheila Andrea R. Bollozos\'s details.', '2026-05-16 00:28:40', '2026-05-16 00:28:40'),
(62, 'USER', 'Zack-Mio A. Sermon updated Zackiee Mio A. Sermon\'s details.', '2026-05-16 00:29:28', '2026-05-16 00:29:28'),
(63, 'USER', 'Zack-Mio A. Sermon updated Zackiee Mio A. Sermon\'s account.', '2026-05-16 00:31:27', '2026-05-16 00:31:27'),
(64, 'USER', 'Zackiee Mio A. Sermon has logged into the system using Chrome.', '2026-05-16 00:33:33', '2026-05-16 00:33:33'),
(65, 'USER', 'Zack-Mio A. Sermon updated Zackiee Mio A. Sermon\'s account.', '2026-05-16 00:50:26', '2026-05-16 00:50:26'),
(66, 'USER', 'Zack-Mio A. Sermon updated Zackiee Mio A. Sermon\'s badge.', '2026-05-16 02:37:03', '2026-05-16 02:37:03'),
(67, 'USER', 'Zack-Mio A. Sermon updated Zackiee Mio A. Sermon\'s badge.', '2026-05-16 02:37:53', '2026-05-16 02:37:53'),
(68, 'USER', 'Zack-Mio A. Sermon updated Zackiee Mio A. Sermon\'s badge.', '2026-05-16 02:38:10', '2026-05-16 02:38:10'),
(69, 'USER', 'Zackiee Mio A. Sermon has logged into the system using Chrome.', '2026-05-16 02:43:03', '2026-05-16 02:43:03'),
(70, 'USER', 'Zack-Mio A. Sermon updated Zackiee Mio A. Sermon\'s badge.', '2026-05-16 02:44:02', '2026-05-16 02:44:02'),
(71, 'USER', 'Zack-Mio A. Sermon updated Zackiee Mio A. Sermon\'s avatar.', '2026-05-16 03:08:35', '2026-05-16 03:08:35'),
(72, 'USER', 'Zack-Mio A. Sermon updated Zackiee Mio A. Sermon\'s esignature.', '2026-05-16 03:53:37', '2026-05-16 03:53:37'),
(73, 'USER', 'Zack-Mio A. Sermon deactivate Zackiee Mio A. Sermon from the system.', '2026-05-16 06:18:04', '2026-05-16 06:18:04'),
(74, 'USER', 'Zack-Mio A. Sermon reactivate Zackiee Mio A. Sermon from the system.', '2026-05-16 06:44:25', '2026-05-16 06:44:25'),
(75, 'USER', 'Zack-Mio A. Sermon deactivate Zackiee Mio A. Sermon from the system.', '2026-05-16 06:44:55', '2026-05-16 06:44:55'),
(76, 'USER', 'Zack-Mio A. Sermon reactivate Zackiee Mio A. Sermon from the system.', '2026-05-16 08:34:26', '2026-05-16 08:34:26'),
(77, 'USER', 'Zack-Mio A. Sermon deactivate Zackiee Mio A. Sermon from the system.', '2026-05-16 08:34:35', '2026-05-16 08:34:35'),
(78, 'USER', 'Zack-Mio A. Sermon updated Jeffrey Datu . Islao\'s details.', '2026-05-19 01:01:35', '2026-05-19 01:01:35'),
(79, 'USER', 'Zack-Mio A. Sermon updated Jeffrey Datu . Islao\'s details.', '2026-05-19 01:04:04', '2026-05-19 01:04:04'),
(80, 'USER', 'Zack-Mio A. Sermon updated Jeffrey Datu . Islao\'s details.', '2026-05-19 01:09:20', '2026-05-19 01:09:20'),
(81, 'USER', 'Zack-Mio A. Sermon updated Jeffrey Datu . Islao\'s details.', '2026-05-19 01:10:21', '2026-05-19 01:10:21'),
(82, 'USER', 'Zack-Mio A. Sermon updated Jeffrey Datu N. Islao\'s details.', '2026-05-19 01:19:31', '2026-05-19 01:19:31'),
(83, 'USER', 'Zack-Mio A. Sermon updated Jeffrey Datu N. Islao\'s account.', '2026-05-19 01:20:02', '2026-05-19 01:20:02'),
(84, 'USER', 'Juan D. Cruz was registered in the system by Zack-Mio A. Sermon.', '2026-05-19 02:08:23', '2026-05-19 02:08:23'),
(85, 'USER', 'John A. Doe was registered in the system by Zack-Mio A. Sermon.', '2026-05-19 06:57:36', '2026-05-19 06:57:36'),
(86, 'USER', 'Jane A. Doe was registered in the system by Zack-Mio A. Sermon.', '2026-05-19 07:01:28', '2026-05-19 07:01:28'),
(87, 'USER', 'Zack-Mio A. Sermon deactivate Jane null. Doe from the system.', '2026-05-19 07:02:02', '2026-05-19 07:02:02'),
(88, 'FORM', 'Zack-Mio A. Sermon has submitted the request for Pre/Post Repair Inspection.', '2026-05-22 02:19:12', '2026-05-22 02:19:12'),
(89, 'FORM', 'Zack-Mio A. Sermon has canceled the request for the Pre/Post Repair Inspection Form (Control No. 51).', '2026-05-22 02:20:03', '2026-05-22 02:20:03'),
(90, 'USER', 'Dennis S. Cambaya has logged into the system using Chrome.', '2026-05-22 02:20:50', '2026-05-22 02:20:50'),
(91, 'FORM', 'Dennis S. Cambaya has submitted the request for Pre/Post Repair Inspection.', '2026-05-22 02:32:18', '2026-05-22 02:32:18'),
(92, 'FORM', 'Dennis S. Cambaya has updated Part A of the Pre/Post Repair Inspection Form (Control No. 52).', '2026-05-22 02:34:09', '2026-05-22 02:34:09'),
(93, 'USER', 'Joel B. Escala has logged into the system using Edge.', '2026-05-22 02:35:45', '2026-05-22 02:35:45'),
(94, 'FORM', 'Dennis S. Cambaya has canceled the request for the Pre/Post Repair Inspection Form (Control No. 52).', '2026-05-22 02:41:35', '2026-05-22 02:41:35'),
(95, 'FORM', 'Dennis S. Cambaya has submitted the request for Pre/Post Repair Inspection.', '2026-05-22 02:42:58', '2026-05-22 02:42:58'),
(96, 'INSP', 'Joel B. Escala has disapproved the request on the Pre/Post Repair Inspection Form (Control No. 53).', '2026-05-22 02:45:50', '2026-05-22 02:45:50'),
(97, 'FORM', 'Dennis S. Cambaya has submitted the request for Pre/Post Repair Inspection.', '2026-05-22 02:47:05', '2026-05-22 02:47:05'),
(98, 'FORM', 'Dennis S. Cambaya has updated Part A of the Pre/Post Repair Inspection Form (Control No. 54).', '2026-05-22 02:49:00', '2026-05-22 02:49:00'),
(99, 'FORM', 'Joel B. Escala has approved the request on the Pre/Post Repair Inspection Form (Control No. 54).', '2026-05-22 03:01:14', '2026-05-22 03:01:14'),
(100, 'USER', 'Joel B. Escala has logged out on the system.', '2026-05-22 03:02:19', '2026-05-22 03:02:19'),
(101, 'USER', 'Sue Christine A. Sade has logged into the system using Edge.', '2026-05-22 03:02:53', '2026-05-22 03:02:53'),
(102, 'FORM', 'Sue Christine A. Sade has updated Part A of the Pre/Post Repair Inspection Form (Control No. 54).', '2026-05-22 03:04:43', '2026-05-22 03:04:43'),
(103, 'FORM', 'Sue Christine A. Sade has filled out Part B of the Pre/Post Repair Inspection Form (Control No. 54)', '2026-05-22 03:06:16', '2026-05-22 03:06:16'),
(104, 'FORM', 'Sue Christine A. Sade has updated Part B of the Pre/Post Repair Inspection Form (Control No. 54).', '2026-05-22 03:07:00', '2026-05-22 03:07:00'),
(105, 'USER', 'Sue Christine A. Sade has logged out on the system.', '2026-05-22 03:08:27', '2026-05-22 03:08:27'),
(106, 'USER', 'Naomie D. Zalsos has logged into the system using Edge.', '2026-05-22 03:08:40', '2026-05-22 03:08:40'),
(107, 'FORM', 'Naomie D. Zalsos has approved the request on the Pre/Post Repair Inspection Form (Control No. 54).', '2026-05-22 03:10:19', '2026-05-22 03:10:19'),
(108, 'FORM', 'Zack-Mio A. Sermon has filled out Part C of the Pre/Post Repair Inspection Form (Control No. 54).', '2026-05-22 03:21:17', '2026-05-22 03:21:17'),
(109, 'FORM', 'Zack-Mio A. Sermon has updated Part C of the Pre/Post Repair Inspection Form (Control No. 54).', '2026-05-22 03:21:36', '2026-05-22 03:21:36'),
(110, 'FORM', 'Zack-Mio A. Sermon has filled out Part D of the Pre/Post Repair Inspection Form (Control No. 54).', '2026-05-22 03:36:05', '2026-05-22 03:36:05'),
(111, 'USER', 'Naomie D. Zalsos has logged out on the system.', '2026-05-22 03:37:50', '2026-05-22 03:37:50'),
(112, 'USER', 'Cheryl C. Saluta has logged into the system using Edge.', '2026-05-22 03:38:24', '2026-05-22 03:38:24'),
(113, 'FORM', 'Cheryl C. Saluta has submitted the request for Pre/Post Repair Inspection.', '2026-05-22 03:40:09', '2026-05-22 03:40:09'),
(114, 'USER', 'Cheryl C. Saluta has logged out on the system.', '2026-05-22 03:46:00', '2026-05-22 03:46:00'),
(115, 'USER', 'Sue Christine A. Sade has logged into the system using Edge.', '2026-05-22 03:46:08', '2026-05-22 03:46:08'),
(116, 'FORM', 'Sue Christine A. Sade has filled out Part B of the Pre/Post Repair Inspection Form (Control No. 55)', '2026-05-22 03:54:12', '2026-05-22 03:54:12'),
(117, 'USER', 'Sue Christine A. Sade has logged out on the system.', '2026-05-22 03:54:27', '2026-05-22 03:54:27'),
(118, 'USER', 'Naomie D. Zalsos has logged into the system using Edge.', '2026-05-22 03:54:44', '2026-05-22 03:54:44'),
(119, 'FORM', 'Naomie D. Zalsos has approved the request on the Pre/Post Repair Inspection Form (Control No. 55).', '2026-05-22 03:55:55', '2026-05-22 03:55:55'),
(120, 'USER', 'Naomie D. Zalsos has logged out on the system.', '2026-05-22 03:56:10', '2026-05-22 03:56:10'),
(121, 'USER', 'Arthur B. Nogas has logged into the system using Edge.', '2026-05-22 03:56:37', '2026-05-22 03:56:37'),
(122, 'FORM', 'Arthur B. Nogas has submitted the request for Pre/Post Repair Inspection.', '2026-05-22 03:58:34', '2026-05-22 03:58:34'),
(123, 'USER', 'Arthur B. Nogas has logged out on the system.', '2026-05-22 04:00:15', '2026-05-22 04:00:15'),
(124, 'USER', 'Sue Christine A. Sade has logged into the system using Edge.', '2026-05-22 04:00:40', '2026-05-22 04:00:40'),
(125, 'FORM', 'Sue Christine A. Sade has filled out Part B of the Pre/Post Repair Inspection Form (Control No. 56)', '2026-05-22 04:03:47', '2026-05-22 04:03:47'),
(126, 'USER', 'Sue Christine A. Sade has logged out on the system.', '2026-05-22 04:04:07', '2026-05-22 04:04:07'),
(127, 'USER', 'Naomie D. Zalsos has logged into the system using Edge.', '2026-05-22 04:04:12', '2026-05-22 04:04:12'),
(128, 'FORM', 'Naomie D. Zalsos has approved the request on the Pre/Post Repair Inspection Form (Control No. 56).', '2026-05-22 04:05:20', '2026-05-22 04:05:20'),
(129, 'SYSTEM', 'Maintenance mode activated.', '2026-05-22 07:01:13', '2026-05-22 07:01:13'),
(130, 'SYSTEM', 'Maintenance mode deactivated.', '2026-05-22 07:02:03', '2026-05-22 07:02:03'),
(131, 'USER', 'Zack-Mio A. Sermon has logged out on the system.', '2026-05-23 05:41:17', '2026-05-23 05:41:17'),
(132, 'USER', 'Zack-Mio A. Sermon has logged into the system using Chrome.', '2026-05-26 03:26:15', '2026-05-26 03:26:15'),
(133, 'FORM', 'Zack-Mio A. Sermon has submitted a Vehicle Slip request.', '2026-05-26 05:43:25', '2026-05-26 05:43:25'),
(134, 'USER', 'Joan G. Bongcawel has logged into the system using Chrome.', '2026-05-26 05:43:44', '2026-05-26 05:43:44'),
(135, 'USER', 'Zack-Mio A. Sermon updated Joan G. Bongcawel\'s badge.', '2026-05-26 05:45:45', '2026-05-26 05:45:45'),
(136, 'USER', 'Joan G. Bongcawel has logged into the system using Chrome.', '2026-05-26 05:46:01', '2026-05-26 05:46:01'),
(137, 'FORM', 'Joan G. Bongcawel has assigned a driver and vehicle to Zack-Mio A. Sermon\'s request on Vehicle Slip No.5.', '2026-05-26 05:50:27', '2026-05-26 05:50:27'),
(138, 'USER', 'Joan G. Bongcawel has logged out on the system.', '2026-05-26 05:52:18', '2026-05-26 05:52:18'),
(139, 'USER', 'Zack-Mio A. Sermon reactivate Zackiee Mio A. Sermon from the system.', '2026-05-28 02:30:31', '2026-05-28 02:30:31'),
(140, 'USER', 'Zack-Mio A. Sermon updated Zackiee Mio A. Sermon\'s account.', '2026-05-28 02:30:51', '2026-05-28 02:30:51'),
(141, 'USER', 'Zack-Mio A. Sermon has logged out on the system.', '2026-05-28 02:36:46', '2026-05-28 02:36:46'),
(142, 'USER', 'Zack-Mio A. Sermon has logged into the system using Chrome.', '2026-05-28 02:37:06', '2026-05-28 02:37:06'),
(143, 'USER', 'Zack-Mio A. Sermon has logged out on the system.', '2026-05-28 02:37:30', '2026-05-28 02:37:30'),
(144, 'USER', 'Zack-Mio A. Sermon has logged into the system using Chrome.', '2026-05-28 03:12:30', '2026-05-28 03:12:30'),
(145, 'USER', 'Zack-Mio A. Sermon has logged into the system using Chrome.', '2026-05-28 03:13:34', '2026-05-28 03:13:34');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(2, '2024_07_31_161217_create_ppa_user_table', 2),
(3, '2024_08_05_134457_create_announcement_table', 3),
(4, '2024_08_07_151604_create_logs_table', 4),
(5, '2024_08_09_134442_create_joms_inspection_form_table', 5),
(6, '2024_08_14_101647_create_assign_personnel_table', 6),
(7, '2024_08_20_091611_create_notification_table', 7),
(8, '2024_08_22_084714_create_joms_facility_venue_table', 8),
(9, '2024_09_11_152952_create_vehicle_slip_form_table', 9),
(10, '2024_09_13_085443_create_joms_vehicle_type_table', 10),
(11, '2024_11_20_151423_create_ppa_security', 11),
(12, '2025_08_07_090324_create_form_request_tracker', 12);

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `type_of_jlms` varchar(255) NOT NULL,
  `sender_avatar` varchar(255) NOT NULL,
  `sender_id` smallint(6) NOT NULL,
  `sender_name` varchar(255) NOT NULL,
  `message` varchar(500) NOT NULL,
  `receiver_id` smallint(6) NOT NULL,
  `receiver_name` varchar(255) NOT NULL,
  `joms_type` varchar(255) DEFAULT NULL,
  `joms_id` smallint(6) DEFAULT NULL,
  `status` smallint(6) NOT NULL,
  `form_location` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `type_of_jlms`, `sender_avatar`, `sender_id`, `sender_name`, `message`, `receiver_id`, `receiver_name`, `joms_type`, `joms_id`, `status`, `form_location`, `created_at`, `updated_at`) VALUES
(4, 'JOMS', 'Zack-Mio_Sermon_avatar.jpg', 1, 'Zack-Mio A. Sermon', 'There is a request for Zack-Mio A. Sermon.', 9, 'Sue Christine A. Sade', 'JOMS_Vehicle', 2, 1, 0, '2026-05-09 01:45:47', '2026-05-09 01:53:37'),
(5, 'JOMS', 'Zack-Mio_Sermon_avatar.jpg', 1, 'Zack-Mio A. Sermon', 'There is a request for Zack-Mio A. Sermon.', 44, 'Joel A. Magno', 'JOMS_Vehicle', 2, 1, 0, '2026-05-09 01:45:47', '2026-05-09 02:31:17'),
(6, 'JOMS', 'Zack-Mio_Sermon_avatar.jpg', 1, 'Zack-Mio A. Sermon', 'There is a request for Zack-Mio A. Sermon.', 68, 'Daryl T. Sumanoy', 'JOMS_Vehicle', 2, 0, 0, '2026-05-09 01:45:47', '2026-05-09 01:45:47'),
(7, 'JOMS', 'Sue_Christine_Sade_avatar.jpg', 9, 'Sue Christine A. Sade', 'There is a request for Zack-Mio A. Sermon that needs your approval.', 76, 'Naomie D. Zalsos', 'JOMS_Vehicle', 2, 1, 0, '2026-05-09 02:22:57', '2026-05-09 02:33:17'),
(8, 'JOMS', 'Naomie_Zalsos_avatar.jpg', 76, 'Naomie D. Zalsos', 'The request for Zack-Mio A. Sermon has been approved by the Admin Manager.', 9, 'Sue Christine A. Sade', 'JOMS_Vehicle', 2, 0, 0, '2026-05-09 02:33:44', '2026-05-09 02:33:44'),
(9, 'JOMS', 'Naomie_Zalsos_avatar.jpg', 76, 'Naomie D. Zalsos', 'Your request has been approved by the Admin Manager.', 1, 'Zack-Mio A. Sermon', 'JOMS_Vehicle', 2, 0, 0, '2026-05-09 02:33:44', '2026-05-09 02:33:44'),
(10, 'JOMS', 'Sue_Christine_Sade_avatar.jpg', 9, 'Sue Christine A. Sade', 'There is a request for Sue Christine A. Sade and needs your approval.', 2, 'Arthur B. Nogas', 'JOMS_Vehicle', 3, 1, 0, '2026-05-09 05:20:54', '2026-05-09 05:41:06'),
(11, 'JOMS', 'Arthur_Nogas_avatar.jpg', 2, 'Arthur B. Nogas', 'Your request has been approved by the Port Manager.', 9, 'Sue Christine A. Sade', 'JOMS_Vehicle', 3, 0, 0, '2026-05-09 06:02:53', '2026-05-09 06:02:53'),
(12, 'JOMS', 'Dennis_Cambaya_avatar.jpg', 22, 'Dennis S. Cambaya', 'There is a request for Dennis S. Cambaya.', 9, 'Sue Christine A. Sade', 'JOMS_Vehicle', 4, 1, 0, '2026-05-09 06:09:04', '2026-05-09 06:13:46'),
(13, 'JOMS', 'Dennis_Cambaya_avatar.jpg', 22, 'Dennis S. Cambaya', 'There is a request for Dennis S. Cambaya.', 44, 'Joel A. Magno', 'JOMS_Vehicle', 4, 0, 0, '2026-05-09 06:09:04', '2026-05-09 06:09:04'),
(14, 'JOMS', 'Dennis_Cambaya_avatar.jpg', 22, 'Dennis S. Cambaya', 'There is a request for Dennis S. Cambaya.', 68, 'Daryl T. Sumanoy', 'JOMS_Vehicle', 4, 0, 0, '2026-05-09 06:09:04', '2026-05-09 06:09:04'),
(15, 'JOMS', 'Sue_Christine_Sade_avatar.jpg', 9, 'Sue Christine A. Sade', 'There is a request for Dennis S. Cambaya that needs your approval.', 2, 'Arthur B. Nogas', 'JOMS_Vehicle', 4, 1, 0, '2026-05-09 06:16:48', '2026-05-09 06:21:41'),
(16, 'JOMS', 'Arthur_Nogas_avatar.jpg', 2, 'Arthur B. Nogas', 'Your request has been disapproved by Port Manager.', 22, 'Dennis S. Cambaya', 'JOMS_Vehicle', 4, 0, 0, '2026-05-09 06:26:39', '2026-05-09 06:26:39'),
(17, 'JOMS', 'Arthur_Nogas_avatar.jpg', 2, 'Arthur B. Nogas', 'The request for Dennis S. Cambaya was disapproved by the Port Manager.', 9, 'Sue Christine A. Sade', 'JOMS_Vehicle', 4, 0, 0, '2026-05-09 06:26:39', '2026-05-09 06:26:39'),
(18, 'JOMS', 'Zack-Mio_Sermon_avatar.jpg', 1, 'Zack-Mio A. Sermon', 'Zack-Mio A. Sermon has submitted a request and needs your approval.', 18, 'Sheila Andrea R. Bollozos', 'JOMS_Inspection', 50, 1, 0, '2026-05-12 08:30:12', '2026-05-12 08:34:32'),
(19, 'JOMS', 'Sheila_Andrea_Bollozos_avatar.jpg', 18, 'Sheila Andrea R. Bollozos', 'Your request has been disapproved by Sheila Andrea R. Bollozos.', 1, 'Zack-Mio A. Sermon', 'JOMS_Inspection', 50, 0, 0, '2026-05-13 01:03:25', '2026-05-13 01:03:25'),
(20, 'JOMS', 'Sheila_Andrea_Bollozos_avatar.jpg', 18, 'Sheila Andrea R. Bollozos', 'The request for Zack-Mio A. Sermon has been disapproved by Sheila Andrea R. Bollozos.', 9, 'Sue Christine A. Sade', 'JOMS_Inspection', 50, 0, 0, '2026-05-13 01:03:25', '2026-05-13 01:03:25'),
(23, 'JOMS', 'Dennis_Cambaya_avatar.jpg', 22, 'Dennis S. Cambaya', 'Dennis S. Cambaya has submitted a request and needs your approval.', 4, 'Joel B. Escala', 'JOMS_Inspection', 53, 1, 0, '2026-05-22 02:42:58', '2026-05-22 02:44:50'),
(24, 'JOMS', 'Joel_Escala_avatar.jpg', 4, 'Joel B. Escala', 'Your request has been disapproved by Joel B. Escala.', 22, 'Dennis S. Cambaya', 'JOMS_Inspection', 53, 0, 0, '2026-05-22 02:45:50', '2026-05-22 02:45:50'),
(25, 'JOMS', 'Joel_Escala_avatar.jpg', 4, 'Joel B. Escala', 'The request for Dennis S. Cambaya has been disapproved by Joel B. Escala.', 9, 'Sue Christine A. Sade', 'JOMS_Inspection', 53, 0, 0, '2026-05-22 02:45:50', '2026-05-22 02:45:50'),
(26, 'JOMS', 'Dennis_Cambaya_avatar.jpg', 22, 'Dennis S. Cambaya', 'Dennis S. Cambaya has submitted a request and needs your approval.', 4, 'Joel B. Escala', 'JOMS_Inspection', 54, 1, 0, '2026-05-22 02:47:05', '2026-05-22 03:00:48'),
(27, 'JOMS', 'Joel_Escala_avatar.jpg', 4, 'Joel B. Escala', 'Your request has been approved by Joel B. Escala.', 22, 'Dennis S. Cambaya', 'JOMS_Inspection', 54, 0, 0, '2026-05-22 03:01:14', '2026-05-22 03:01:14'),
(28, 'JOMS', 'Joel_Escala_avatar.jpg', 4, 'Joel B. Escala', 'The request for Dennis S. Cambaya has been approved by Joel B. Escala.', 9, 'Sue Christine A. Sade', 'JOMS_Inspection', 54, 1, 0, '2026-05-22 03:01:14', '2026-05-22 03:03:36'),
(29, 'JOMS', 'Sue_Christine_Sade_avatar.jpg', 9, 'Sue Christine A. Sade', 'The GSO has completed Part B of your request. It is now pending approval from the Admin Manager.', 22, 'Dennis S. Cambaya', 'JOMS_Inspection', 54, 0, 0, '2026-05-22 03:06:16', '2026-05-22 03:06:16'),
(30, 'JOMS', 'Sue_Christine_Sade_avatar.jpg', 9, 'Sue Christine A. Sade', 'The GSO has filled out Part B and is now waiting for your approval.', 76, 'Naomie D. Zalsos', 'JOMS_Inspection', 54, 1, 0, '2026-05-22 03:06:16', '2026-05-22 03:09:29'),
(31, 'JOMS', 'Naomie_Zalsos_avatar.jpg', 76, 'Naomie D. Zalsos', 'Your request has been approved by the Admin Manager', 22, 'Dennis S. Cambaya', 'JOMS_Inspection', 54, 0, 0, '2026-05-22 03:10:19', '2026-05-22 03:10:19'),
(32, 'JOMS', 'Naomie_Zalsos_avatar.jpg', 76, 'Naomie D. Zalsos', 'You have been assigned to this task.', 1, 'Zack-Mio A. Sermon', 'JOMS_Inspection', 54, 1, 0, '2026-05-22 03:10:19', '2026-05-22 03:10:58'),
(33, 'JOMS', 'Naomie_Zalsos_avatar.jpg', 76, 'Naomie D. Zalsos', 'The request for Dennis S. Cambaya has been approved by the Admin Manager.', 9, 'Sue Christine A. Sade', 'JOMS_Inspection', 54, 0, 0, '2026-05-22 03:10:19', '2026-05-22 03:10:19'),
(34, 'JOMS', 'Zack-Mio_Sermon_avatar.jpg', 1, 'Zack-Mio A. Sermon', 'Zack-Mio A. Sermon has finished filling out the Part C.', 9, 'Sue Christine A. Sade', 'JOMS_Inspection', 54, 0, 0, '2026-05-22 03:21:17', '2026-05-22 03:21:17'),
(35, 'JOMS', 'Zack-Mio_Sermon_avatar.jpg', 1, 'Zack-Mio A. Sermon', 'The request for Dennis S. Cambaya is complete.', 9, 'Sue Christine A. Sade', 'JOMS_Inspection', 54, 0, 0, '2026-05-22 03:36:05', '2026-05-22 03:36:05'),
(36, 'JOMS', 'Zack-Mio_Sermon_avatar.jpg', 1, 'Zack-Mio A. Sermon', 'Your request has been completed.', 22, 'Dennis S. Cambaya', 'JOMS_Inspection', 54, 0, 0, '2026-05-22 03:36:05', '2026-05-22 03:36:05'),
(37, 'JOMS', 'Cheryl_Saluta_avatar.jpg', 6, 'Cheryl C. Saluta', 'Cheryl C. Saluta has submitted a request.', 9, 'Sue Christine A. Sade', 'JOMS_Inspection', 55, 1, 0, '2026-05-22 03:40:09', '2026-05-22 03:51:01'),
(38, 'JOMS', 'Sue_Christine_Sade_avatar.jpg', 9, 'Sue Christine A. Sade', 'The GSO has completed Part B of your request. It is now pending approval from the Admin Manager.', 6, 'Cheryl C. Saluta', 'JOMS_Inspection', 55, 0, 0, '2026-05-22 03:54:12', '2026-05-22 03:54:12'),
(39, 'JOMS', 'Sue_Christine_Sade_avatar.jpg', 9, 'Sue Christine A. Sade', 'The GSO has filled out Part B and is now waiting for your approval.', 76, 'Naomie D. Zalsos', 'JOMS_Inspection', 55, 1, 0, '2026-05-22 03:54:12', '2026-05-22 03:55:28'),
(40, 'JOMS', 'Naomie_Zalsos_avatar.jpg', 76, 'Naomie D. Zalsos', 'Your request has been approved by the Admin Manager', 6, 'Cheryl C. Saluta', 'JOMS_Inspection', 55, 0, 0, '2026-05-22 03:55:55', '2026-05-22 03:55:55'),
(41, 'JOMS', 'Naomie_Zalsos_avatar.jpg', 76, 'Naomie D. Zalsos', 'You have been assigned to this task.', 1, 'Zack-Mio A. Sermon', 'JOMS_Inspection', 55, 0, 0, '2026-05-22 03:55:55', '2026-05-22 03:55:55'),
(42, 'JOMS', 'Naomie_Zalsos_avatar.jpg', 76, 'Naomie D. Zalsos', 'The request for Cheryl C. Saluta has been approved by the Admin Manager.', 9, 'Sue Christine A. Sade', 'JOMS_Inspection', 55, 0, 0, '2026-05-22 03:55:55', '2026-05-22 03:55:55'),
(43, 'JOMS', 'Arthur_Nogas_avatar.jpg', 2, 'Arthur B. Nogas', 'Arthur B. Nogas has submitted a request.', 9, 'Sue Christine A. Sade', 'JOMS_Inspection', 56, 1, 0, '2026-05-22 03:58:34', '2026-05-22 04:02:41'),
(44, 'JOMS', 'Sue_Christine_Sade_avatar.jpg', 9, 'Sue Christine A. Sade', 'The GSO has completed Part B of your request. It is now pending approval from the Admin Manager.', 2, 'Arthur B. Nogas', 'JOMS_Inspection', 56, 0, 0, '2026-05-22 04:03:47', '2026-05-22 04:03:47'),
(45, 'JOMS', 'Sue_Christine_Sade_avatar.jpg', 9, 'Sue Christine A. Sade', 'The GSO has filled out Part B and is now waiting for your approval.', 76, 'Naomie D. Zalsos', 'JOMS_Inspection', 56, 1, 0, '2026-05-22 04:03:47', '2026-05-22 04:04:45'),
(46, 'JOMS', 'Naomie_Zalsos_avatar.jpg', 76, 'Naomie D. Zalsos', 'Your request has been approved by the Admin Manager', 2, 'Arthur B. Nogas', 'JOMS_Inspection', 56, 0, 0, '2026-05-22 04:05:20', '2026-05-22 04:05:20'),
(47, 'JOMS', 'Naomie_Zalsos_avatar.jpg', 76, 'Naomie D. Zalsos', 'You have been assigned to this task.', 1, 'Zack-Mio A. Sermon', 'JOMS_Inspection', 56, 1, 0, '2026-05-22 04:05:20', '2026-05-29 00:57:56'),
(48, 'JOMS', 'Naomie_Zalsos_avatar.jpg', 76, 'Naomie D. Zalsos', 'The request for Arthur B. Nogas has been approved by the Admin Manager.', 9, 'Sue Christine A. Sade', 'JOMS_Inspection', 56, 0, 0, '2026-05-22 04:05:20', '2026-05-22 04:05:20'),
(49, 'JOMS', 'Zack-Mio_Sermon_avatar.jpg', 1, 'Zack-Mio A. Sermon', 'There is a request for Zack-Mio A. Sermon.', 9, 'Sue Christine A. Sade', 'JOMS_Vehicle', 5, 0, 0, '2026-05-26 05:43:24', '2026-05-26 05:43:24'),
(50, 'JOMS', 'Zack-Mio_Sermon_avatar.jpg', 1, 'Zack-Mio A. Sermon', 'There is a request for Zack-Mio A. Sermon.', 44, 'Joel A. Magno', 'JOMS_Vehicle', 5, 0, 0, '2026-05-26 05:43:24', '2026-05-26 05:43:24'),
(51, 'JOMS', 'Zack-Mio_Sermon_avatar.jpg', 1, 'Zack-Mio A. Sermon', 'There is a request for Zack-Mio A. Sermon.', 68, 'Daryl T. Sumanoy', 'JOMS_Vehicle', 5, 0, 0, '2026-05-26 05:43:24', '2026-05-26 05:43:24'),
(52, 'JOMS', 'Joan_Bongcawel_avatar.jpg', 19, 'Joan G. Bongcawel', 'There is a request for Zack-Mio A. Sermon that needs your approval.', 76, 'Naomie D. Zalsos', 'JOMS_Vehicle', 5, 0, 0, '2026-05-26 05:50:27', '2026-05-26 05:50:27');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\PPAEmployee', 1, 'PPA_Token', 'c46dfdc62d0adeaf08e653cbba18eb7bac4d921fa8596bb1153006fc791796f0', '[\"*\"]', '2026-05-30 00:42:39', NULL, '2026-05-28 03:13:34', '2026-05-30 00:42:39');

-- --------------------------------------------------------

--
-- Table structure for table `ppa_security`
--

CREATE TABLE `ppa_security` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` int(11) NOT NULL,
  `hostingname` varchar(255) DEFAULT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ppa_security`
--

INSERT INTO `ppa_security` (`id`, `user_id`, `hostingname`, `browser`, `created_at`, `updated_at`) VALUES
(346, 79, NULL, 'Chrome', '2026-01-16 01:30:25', '2026-01-16 01:30:25'),
(355, 65, NULL, 'Edge', '2026-01-20 06:03:13', '2026-01-20 06:03:13'),
(431, 82, NULL, 'Chrome', '2026-03-27 02:29:58', '2026-03-27 02:29:58'),
(473, 22, NULL, 'Chrome', '2026-05-22 02:20:50', '2026-05-22 02:20:50'),
(482, 76, NULL, 'Edge', '2026-05-22 04:04:12', '2026-05-22 04:04:12'),
(486, 1, NULL, 'Chrome', '2026-05-28 03:12:30', '2026-05-28 03:12:30');

-- --------------------------------------------------------

--
-- Table structure for table `ppa_user`
--

CREATE TABLE `ppa_user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `middlename` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `division` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `code_clearance` varchar(255) NOT NULL,
  `esign` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `userId` varchar(20) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ppa_user`
--

INSERT INTO `ppa_user` (`id`, `firstname`, `middlename`, `lastname`, `gender`, `division`, `position`, `code_clearance`, `esign`, `avatar`, `userId`, `username`, `password`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Zack-Mio', 'A', 'Sermon', 'Male', 'Administrative Division', 'Information System Analyst ll', 'HACK, AP', 'Zack-Mio_Sermon_esignature.png', 'Zack-Mio_Sermon_avatar.jpg', 'JOMS-202600001', 'zackmio2024', '$2y$10$wwOuqJWvdW9P0FYspCD2buyRaZclnfLB2uRYO1Tv7mV/bJFnEVCNu', 1, '2024-08-02 04:05:30', '2026-05-15 07:46:47'),
(2, 'Arthur', 'B', 'Nogas', 'Male', 'Office of the Port Manager', 'Acting Port Manager', 'PM', 'Arthur_Nogas_esignature.png', 'Arthur_Nogas_avatar.jpg', 'JOMS-202600002', 'ppa_nogas', '$2y$10$f9pmy/dYIgLsgZOcRlSbmuu4vVKDCfZ15nub2g4QeP9jU8qboBZF2', 1, '2024-09-26 02:51:39', '2026-05-15 07:38:51'),
(4, 'Joel', 'B', 'Escala', 'Male', 'Engineering Service Division', 'Division Manager A', 'DM', 'Joel_Escala_esignature.png', 'Joel_Escala_avatar.jpg', 'JOMS-202600004', 'ppa_joel', '$2y$10$Q7lBtHMUVIjAridJzx5uR.hTVmM4Tl9XmB4jrRjIHRDCVzFdzETLW', 1, '2024-09-26 02:55:21', '2026-05-19 00:38:49'),
(5, 'Omar', 'A', 'Sabdani', 'Male', 'Terminal Management Office - Tubod', 'Division Manager C', 'DM', 'Omar_Sabdani_esignature.png', 'Omar_Sabdani_avatar.jpg', '', 'ppa_omar', '$2y$10$WjkFL7YX2Z1DaGadgMnli.eFmboqkX1x3HTN0eVWMR3pMikwsTclu', 1, '2024-09-26 03:02:05', '2024-09-26 03:02:05'),
(6, 'Cheryl', 'C', 'Saluta', 'Female', 'Finance Division', 'Division Manager A', 'DM', 'Cheryl_Saluta_esignature.png', 'Cheryl_Saluta_avatar.jpg', '', 'ppa_chekong', '$2y$10$f/.h.VUD7YiZCTk/WJNxRe/z7C.Ktgo4yYFmDHeE3WhdPRO8QZaKG', 1, '2024-09-26 03:03:26', '2024-09-26 03:03:26'),
(7, 'Rommel Jason', 'C', 'Zalsos', 'Male', 'Port Police Division', 'Port Police Division Manager', 'DM', 'Rommel_Jason_Zalsos_esignature.png', 'Rommel_Jason_Zalsos_avatar.jpg', '', 'ppa_rommel', '$2y$10$8/XYAm.MUXQEm3phF8TXJe3oaJQFzgudpXFrYvOxRRYLr.ipOtWKO', 1, '2024-09-26 03:05:15', '2024-09-26 03:05:15'),
(8, 'Jose Randy', 'I', 'Pabelino', 'Male', 'Port Service Division', 'Terminal Supervisor A', 'DM', 'Jose_Randy_Pabelino_esignature.png', 'Jose_Randy_Pabelino_avatar.jpg', '', 'ppa_randy', '$2y$10$eODp4S3OiRdY.eK0pkyaNeDCwcRzUpTN1hYikqbQv2UPsOQ4TO2eG', 1, '2024-09-26 03:07:37', '2024-09-26 03:07:37'),
(9, 'Sue Christine', 'A', 'Sade', 'Female', 'Administrative Division', 'General Services Officer A', 'GSO', 'Sue_Christine_Sade_esignature.png', 'Sue_Christine_Sade_avatar.jpg', '', 'ppa_sue', '$2y$10$sw7SXnt/nUh0.5mQTz2ZX.5QQNbBynrwRhTt0AD82G62P/6NZj7yS', 1, '2024-09-26 03:11:53', '2026-01-15 06:52:14'),
(10, 'Laybert', 'S', 'Bakiki', 'Female', 'Finance Division', 'Data Encoder lll', 'MEM', 'Laybert_Bakiki_esignature.png', 'Laybert_Bakiki_avatar.jpg', '', 'ppa_laybert', '$2y$10$Q6jK3SSvkDN7FiXAXU.59uanDYDyfYcPnJ.BlM9awA9X9QMFI.8S6', 1, '2024-09-26 03:13:31', '2025-12-20 06:19:37'),
(11, 'Allan', 'C', 'Balbarino', 'Male', 'Terminal Management Office - Tubod', 'Administrative Aide lll', 'MEM', 'Allan_Balbarino_esignature.png', 'Allan_Balbarino_avatar.jpg', '', 'ppa_allan', '$2y$10$Np2fPX5fNH1TGPdcHI0j5ehzd3eBWJJD25X8qD5gcGru0eob47OrS', 1, '2024-09-26 03:15:44', '2026-04-07 01:51:52'),
(12, 'Clint Bryan', 'B', 'Balmores', 'Male', 'Terminal Management Office - Tubod', 'Collection Representative A', 'MEM, AP', 'Clint_Bryan_Balmores_esignature.png', 'Clint_Bryan_Balmores_avatar.jpg', '', 'ppa_clint', '$2y$10$v2gv0NMHOoE30e/5uWj82ewRBVyVJfmzIjkoUSL3CsXcdw1BxT67S', 1, '2024-09-26 03:17:12', '2026-03-31 03:58:00'),
(13, 'Evelyn', 'A', 'Espinosa', 'Female', 'Office of the Port Manager', 'Executive Assistant A', 'DM', 'Evelyn_Espinosa_esignature.png', 'Evelyn_Espinosa_avatar.jpg', '', 'ppa_evelyn', '$2y$10$f7PkUQWzECW91llEYM4Y2.cwrKE8MiGtzGwFGhp/KTXqOYJNkx/Wa', 1, '2024-09-26 03:24:29', '2024-09-26 03:24:29'),
(14, 'Joyriena Lynn', 'M', 'Seco', 'Female', 'Administrative Division', 'Administrative Officer V', 'DM', 'Joyriena_Lynn_Seco_1773369716_esig.png', 'Joyriena_Lynn_Seco_1773368861_avatar.jpg', '', 'ppa_joyseco', '$2y$10$fDz01UFrRWV5tX1K/F.hPOaE58YtNrSsOdNGiPgc3UCxkJQrXfkJK', 1, '2024-09-26 03:26:05', '2026-03-13 03:39:26'),
(15, 'Janessa', 'P', 'Balt', 'Female', 'Finance Division', 'Clearing Officer IV', 'MEM', 'Janessa_Balt_esignature.png', 'Janessa_Balt_avatar.jpg', '', 'ppa_janessa', '$2y$10$HwllbauPgPlf1fO6eZLP1.Gg4U6a3w4VtEdzQ1OFolvXXtFW9jRXG', 1, '2024-09-26 03:27:44', '2024-09-26 03:27:44'),
(16, 'Rewel', 'B', 'Bares', 'Male', 'Port Service Division', 'Clerk Processor A', 'MEM', 'Rewel_Bares_esignature.png', 'Rewel_Bares_avatar.jpg', '', 'ppa_rewel', '$2y$10$4JXwPdaNkPKi2itVvQNTFeJYYN.cAa64pPGfQmq5Tt.K.iFKP6n/a', 1, '2024-09-26 03:32:54', '2024-09-26 03:32:54'),
(17, 'Lawrence', 'M', 'Bersaldo', 'Male', 'Port Police Division', 'Civil Security Officer C', 'MEM', 'Lawrence_Bersaldo_esignature.png', 'Lawrence_Bersaldo_avatar.jpg', '', 'ppa_lao', '$2y$10$fRNTi31Aa8sOkILrKYhGx.qTvPEW3KoWlTt5RgAOcCkXIqTvtfsNK', 1, '2024-09-26 03:34:48', '2024-09-26 03:34:48'),
(18, 'Sheila Andrea', 'R', 'Bollozos', 'Female', 'Administrative Division', 'Human Resource Management Officer III', 'DM', 'Sheila_Andrea_Bollozos_esignature.png', 'Sheila_Andrea_Bollozos_avatar.jpg', 'JOMS-202600018', 'ppa_sheila', '$2y$10$O.XgxmC.2HCCDWE6jtOOgO3APuU0mgV3ALhdOAMUSMqvpdKEGopqa', 1, '2024-09-26 03:36:03', '2026-05-16 00:25:09'),
(19, 'Joan', 'G', 'Bongcawel', 'Female', 'Administrative Division', 'Liaison Aide', 'AUV', 'Joan_Bongcawel_esignature.png', 'Joan_Bongcawel_avatar.jpg', '', 'ppa_joan', '$2y$10$VLnDDREb/4QGtTu6w1.6u./Fc.5/5ZK2ikxMIBVbGxvJsuSCKZ/Ca', 1, '2024-09-26 03:38:24', '2026-05-26 05:45:45'),
(20, 'Colin Kay', 'R', 'Cajote', 'Male', 'Engineering Service Division', 'Supervising Engineer A', 'MEM, AP', 'Colin_Kay_Cajote_esignature.png', 'Colin_Kay_Cajote_avatar.jpg', '', 'ppa_cajote', '$2y$10$50cZsxIHbhvbbUbNgkh3seB./TuuhI0Ms4vFrajvcCAW7mKjE9TV6', 1, '2024-09-26 03:40:01', '2026-03-31 03:47:33'),
(21, 'Luis', 'A', 'Calderon', 'Male', 'Engineering Service Division', 'Construction Foreman A', 'MEM, AP', 'Luis_Calderon_esignature.png', 'Luis_Calderon_avatar.jpg', '', 'ppa_luis', '$2y$10$WYsD.4cGeqFW9beRSIVdUuNqCFEtu7YmTGQyrvGpt2iuoKSYegIJi', 1, '2024-09-26 03:42:19', '2025-10-30 01:46:13'),
(22, 'Dennis', 'S', 'Cambaya', 'Male', 'Engineering Service Division', 'Engineering Assistant A', 'MEM', 'Dennis_Cambaya_esignature.png', 'Dennis_Cambaya_avatar.jpg', '', 'ppa_dennis', '$2y$10$SbY0h8fpmuJrL9OvA8i3keo6SvafInE2HKZwAQpgXlImFa.UOvlMK', 1, '2024-09-26 03:43:55', '2024-09-26 03:43:55'),
(23, 'Archer', 'A', 'Dahunan', 'Male', 'Engineering Service Division', 'Senior Welder', 'MEM', 'Archer_Dahunan_esignature.png', 'Archer_Dahunan_avatar.jpg', '', 'ppa_dahunan', '$2y$10$NPVe..6Wr7INLsTHuv2Oa.N/InWhO24yf1WawhhFpfpDPiQvnJ6mu', 1, '2024-09-26 03:45:55', '2026-04-03 05:50:31'),
(24, 'Jonalyn', 'N', 'Dandasan', 'Female', 'Finance Division', 'Corporate Finance Services Chief', 'MEM', 'Jonalyn_Dandasan_esignature.png', 'Jonalyn_Dandasan_avatar.jpg', '', 'ppa_dandasan', '$2y$10$9JyvrPNOlIxsxO1i4EO2/.W7PgtwyWl72VKn5MdQDNhQGZJ/9UvW2', 1, '2024-09-26 03:48:20', '2025-02-19 06:39:54'),
(25, 'Edgardo', 'B', 'Dandoy', 'Male', 'Finance Division', 'Cashier B', 'MEM, AP', 'Edgardo_Dandoy_esignature.png', 'Edgardo_Dandoy_avatar.jpg', '', 'ppa_dandoy', '$2y$10$dIhQR6xsARcYNMHsKpYRuusJ6H43k5WZB2nUJ6oaR8G1K5W.BX3Gu', 1, '2024-09-26 03:49:40', '2025-09-25 00:39:46'),
(26, 'Jerome', 'C', 'Diango', 'Male', 'Administrative Division', 'Mason ll (A)', 'MEM', 'Jerome_Diango_esignature.png', 'Jerome_Diango_avatar.jpg', '', 'ppa_diango', '$2y$10$sv/kOAdtAyb8XeCfE/2YOecP7bd18.sTK8fe98ZeJ9ciNISAFpEUy', 1, '2024-09-26 03:53:20', '2024-09-26 03:53:20'),
(27, 'Janrey Vincent', 'P', 'Durano', 'Male', 'Finance Division', 'Cashier B', 'MEM, AP', 'Janrey_Vincent_Durano_esignature.png', 'Janrey_Vincent_Durano_avatar.jpg', '', 'ppa_durano', '$2y$10$gwOMYZhJGBc9cEvP4/D4neFg7uZzriwu2GI1PdoDoHoxWwk/7fRT2', 1, '2024-09-26 03:54:40', '2025-09-18 01:48:29'),
(28, 'Simon Eli', 'P', 'Embay', 'Male', 'Port Service Division', 'Harbor Operations Officer', 'MEM', 'Simon_Eli_Embay_esignature.png', 'Simon_Eli_Embay_avatar.jpg', '', 'ppa_embay', '$2y$10$ShNZOvui9EN2AWzHBGmKwOtJ7L2GBpLhMcAvNvjSss8.tl6ZVNWNK', 1, '2024-09-26 04:01:40', '2026-04-28 01:12:36'),
(29, 'Kate Wendell', 'A', 'Eugenio', 'Female', 'Finance Division', 'Cashier B', 'MEM', 'Kate_Wendell_Eugenio_esignature.png', 'Kate_Wendell_Eugenio_avatar.jpg', '', 'ppa_eugenio', '$2y$10$TAW0w3y4qXFgDMpMbeU0r.2kCS0/nUhShBRVyPvyKgWgXKn/nzhoS', 1, '2024-09-26 05:58:58', '2026-04-03 05:52:30'),
(30, 'Mervin Angelou', 'Q', 'Faeldin', 'Male', 'Engineering Service Division', 'Clerk lV', 'MEM', 'Mervin_Angelou_Faeldin_esignature.png', 'Mervin_Angelou_Faeldin_avatar.jpg', '', 'ppa_faeldin', '$2y$10$CsQgCTO0HAHARamuwsEfw.2Kb5AUZs/gxfRur0esf6uuinYt.Ya8O', 1, '2024-09-26 06:05:11', '2024-09-26 06:05:11'),
(31, 'Jealapril', 'S', 'Fernandez', 'Female', 'Port Service Division', 'Statistician A', 'MEM', 'Jealapril_Fernandez_esignature.png', 'Jealapril_Fernandez_avatar.jpg', '', 'ppa_jealapril', '$2y$10$tTDbqye3hKGxFpl4avnRNec21NTX0Rt2s418HxajAiZcVSf2vRFN6', 1, '2024-09-26 06:06:36', '2026-04-03 06:21:45'),
(33, 'Tedegardo', 'N', 'Garces', 'Male', 'Port Service Division', 'Harbor Master', 'MEM', 'Tedegardo_Garces_esignature.png', 'Tedegardo_Garces_avatar.jpg', '', 'ppa_garces', '$2y$10$cFVubFw3g8v.Ns.gHgMU8.UlvN01lms/wtq.XzNEJVsIGEzmVeL5y', 1, '2024-09-26 06:11:34', '2024-09-26 06:11:34'),
(34, 'Richie Aram', 'B', 'Garganera', 'Male', 'Administrative Division', 'Administrative Services Assistant II', 'MEM', 'Richie_Aram_Garganera_esignature.png', 'Richie_Aram_Garganera_avatar.jpg', '', 'ppa_richie', '$2y$10$S8iKynbGGiDkvVXMeed2xuy.zzLJPIT9BVCrMoUqNNXB0KScZwgGe', 1, '2024-09-26 06:13:07', '2026-04-08 03:23:24'),
(35, 'Joanne Mae', 'S', 'Janulgue', 'Female', 'Office of the Port Manager', 'Executive Secretary C', 'MEM', 'Joanne_Mae_Janulgue_esignature.png', 'Joanne_Mae_Janulgue_avatar.jpg', '', 'ppa_joanne', '$2y$10$LhWy1Ttx8WVsO/ywYvmlwebnBBkaoGXlViUE3vz/ruIukYe.ysjk.', 1, '2024-09-26 06:16:40', '2026-04-07 01:46:51'),
(36, 'Mark Jason', 'I', 'Gengone', 'Male', 'Engineering Service Division', 'Electrician', 'MEM', 'Mark_Jason_Gengone_esignature.png', 'Mark_Jason_Gengone_avatar.jpg', '', 'ppa_gengone', '$2y$10$snngwkGsUQlau5Pa64bMu.cbipuZZ3.tGPEp2u8yq0oF7eJ.lR89i', 1, '2024-09-26 06:19:13', '2024-09-26 06:19:13'),
(37, 'Mark Anthony', 'C', 'Gonzales', 'Male', 'Administrative Division', 'Storekeeper', 'MEM, AP', 'Mark_Anthony_Gonzales_esignature.png', 'Mark_Anthony_Gonzales_avatar.jpg', '', 'ppa_gonzales', '$2y$10$yeFbbRejQsDbTYI7fMKXM.jwdsyKska74ZlaqjujwPJckqw6kV6Iu', 1, '2024-09-26 06:45:04', '2026-01-14 07:08:33'),
(38, 'Cris Ian', 'R', 'Jacinto', 'Male', 'Administrative Division', 'Management Information System Analyst', 'MEM, HACK, AP', 'Cris_Ian_Jacinto_esignature.png', 'Cris_Ian_Jacinto_avatar.jpg', '', 'ppa_ian', '$2y$10$1souIelqRtNH0ImibZtjRu24vIyb9hZ2mI897E.Cd0VjSU6gIykVS', 1, '2024-09-26 06:46:14', '2026-04-07 01:01:58'),
(39, 'Christine', 'R', 'Jacinto', 'Female', 'Finance Division', 'Cashier B', 'MEM', 'Christine_Jacinto_esignature.png', 'Christine_Jacinto_avatar.jpg', '', 'ppa_christine', '$2y$10$cLCfEQHAcZRgMdvV.W14R.S14kgkxCn6fFXXZfJUfZ32YA1ZoLGzu', 1, '2024-09-26 06:47:17', '2024-09-26 06:47:17'),
(40, 'Diony Lou', 'A', 'Jao', 'Female', 'Port Service Division', 'Environmental Specialist A', 'MEM', 'Diony_Lou_Jao_esignature.png', 'Diony_Lou_Jao_avatar.jpg', '', 'ppa_jao', '$2y$10$y/7T0NjMqlGqeLV0BUK64.zUUZy1wCMTt/owrKvY9FHY2NNLSMmka', 1, '2024-09-26 06:49:50', '2024-09-26 06:49:50'),
(41, 'Angelyn', 'M', 'Lepiten', 'Female', 'Office of the Port Manager', 'Project Planning & Development Officer A', 'MEM', 'Angelyn_Lepiten_esignature.png', 'Angelyn_Lepiten_avatar.jpg', '', 'ppa_lepiten', '$2y$10$qB2MZ30eDtzXzfcXiZkZlOKYCthffumGpic1fyQmHAnvGxUUsVG7C', 1, '2024-09-26 06:50:55', '2024-09-26 06:50:55'),
(42, 'Jay Robin', 'S', 'Lluisma', 'Male', 'Administrative Division', 'Electronics Communication System Operator A', 'MEM', 'Jay_Robin_Lluisma_esignature.png', 'Jay_Robin_Lluisma_avatar.jpg', '', 'ppa_lluisma', '$2y$10$fW8PVFxQacUZKgEkbIOVV.MP6j/YLwYYnx9X9/J9GXYa/q6OP15Ve', 1, '2024-09-26 06:52:25', '2025-03-21 01:04:57'),
(43, 'Jan Dexter', 'T', 'Loang', 'Male', 'Administrative Division', 'Driver Mechanic A', 'MEM, AP', 'Jan_Dexter_Loang_esignature.png', 'Jan_Dexter_Loang_avatar.jpg', '', 'ppa_janix', '$2y$10$6ubz1UZblMc1GtN6aIA68.N7q4JrNDCvfPGS84v3dzyqp5pqNTmhC', 1, '2024-09-26 06:53:51', '2024-09-26 08:40:49'),
(44, 'Joel', 'A', 'Magno', 'Male', 'Administrative Division', 'Plant Mechanic/Electrician B', 'AUV, AP', 'Joel_Magno_esignature.png', 'Joel_Magno_avatar.jpg', '', 'ppa_magno', '$2y$10$C8hndP6FIGPbXVV3PAbwXeCNFjBriSQhXMTtCB8ximrWV1nlPrwBK', 1, '2024-09-26 06:54:48', '2026-05-08 05:57:11'),
(45, 'Helbert', 'L', 'Marzon', 'Male', 'Port Police Division', 'Civil Security Officer C', 'MEM', 'Helbert_Marzon_1727339612_esig.png', 'Helbert_Marzon_avatar.jpg', '', 'ppa_marzon', '$2y$10$NDI8LwVupJT22zrftpbcJuKW7UucXQuK3kxraO1J8UsqlfI6bGhoq', 1, '2024-09-26 06:56:59', '2024-09-26 08:33:32'),
(46, 'Juliet', 'B', 'Merioles', 'Female', 'Finance Division', 'Senior Cashier', 'MEM', 'Juliet_Merioles_esignature.png', 'Juliet_Merioles_avatar.jpg', '', 'ppa_merioles', '$2y$10$TdEZs/Y0dpV1NzLSDbRQ6Obi0GdMpEXtblNwULPxjRgDW7yk6Yi/O', 1, '2024-09-26 06:59:03', '2024-09-26 06:59:03'),
(47, 'Christine', 'J', 'Merto', 'Female', 'Finance Division', 'Cashier A', 'MEM', 'Christine_Merto_esignature.png', 'Christine_Merto_avatar.jpg', '', 'ppa_merto', '$2y$10$c9tEwDJgIYdWCn.qmXIoQuxjs0A5wr7ZsET0j6hBAx9i3PgCPPULS', 1, '2024-09-26 07:01:16', '2026-01-14 07:08:14'),
(48, 'Tristan Luke', 'C', 'Misa', 'Male', 'Port Police Division', 'Industrial Security Officer', 'MEM', 'Tristan_Luke_Misa_esignature.png', 'Tristan_Luke_Misa_avatar.jpg', '', 'ppa_misa', '$2y$10$5rZoXS30PMdJf340yNl6.OazmSCbMB7O0R1SVoyDzu11c82JL5Tae', 1, '2024-09-26 07:02:28', '2024-09-26 07:02:28'),
(49, 'Hazel', 'B', 'Nadorra', 'Female', 'Finance Division', 'Cashier B', 'MEM', 'Hazel_Nadorra_esignature.png', 'Hazel_Nadorra_avatar.jpg', '', 'ppa_nadorra', '$2y$10$8NOVIm/xNt4K6xvXEqdcreyeN9L/RoLW6GF25zsuFZ.eGzKSi0ntm', 1, '2024-09-26 07:03:45', '2024-09-26 07:03:45'),
(50, 'Edward Sonny', 'B', 'Namindang', 'Male', 'Administrative Division', 'Electronics Communication System Operator A', 'MEM, AP', 'Edward_Sonny_Namindang_esignature.png', 'Edward_Sonny_Namindang_avatar.jpg', '', 'ppa_sonny', '$2y$10$D219KDFMq3d0abOyNnc1p.uZsigRQRvWC122I3Qanl2qxRmgmNWta', 1, '2024-09-26 07:06:38', '2024-09-26 08:42:12'),
(51, 'Mychel Melchor', 'K', 'Nuevas', 'Male', 'Engineering Service Division', 'Data Encoder lll', 'MEM', 'Mychel_Melchor_Nuevas_esignature.png', 'Mychel_Melchor_Nuevas_avatar.jpg', '', 'ppa_mike', '$2y$10$WaW1OTseYBmodBxGwsL6Eu6fuAuaBhpRK6t10NxrfSwVSgTiNYX8W', 1, '2024-09-26 07:08:08', '2024-09-26 07:08:08'),
(52, 'Mirja', 'C', 'Obach', 'Female', 'Administrative Division', 'Procurement Officer B', 'MEM', 'Mirja_Obach_esignature.png', 'Mirja_Obach_avatar.jpg', '', 'ppa_mirja', '$2y$10$zAyz/2kEQIUcrac8BqkVc.7LHniIht.kovB5xdujb1vH5Emu.Ukw.', 1, '2024-09-26 07:09:15', '2024-09-26 07:09:15'),
(53, 'Arnel', 'O', 'Oclarino', 'Male', 'Engineering Service Division', 'Senior Engineer A', 'MEM', 'Arnel_Oclarino_esignature.png', 'Arnel_Oclarino_avatar.jpg', '', 'ppa_arnel', '$2y$10$EKM5.JvSI/PafUyT1aH77uPcH8T3nz/pSiMywc8X/LHmCsDy93dZi', 1, '2024-09-26 07:11:02', '2024-09-26 07:11:02'),
(54, 'Carolyn Gracelda', 'N', 'Orquillas', 'Female', 'Administrative Division', 'Human Resource Management Officer II', 'MEM', 'Carolyn_Gracelda_Orquillas_esignature.png', 'Carolyn_Gracelda_Orquillas_avatar.jpg', '', 'ppa_girlie', '$2y$10$ObMqzS49KSPqYRZR5kOG4OcP/Petnem2dBXzdXmGCa9NjeutsLV0m', 1, '2024-09-26 07:12:30', '2024-09-26 07:12:30'),
(55, 'Loradel', 'B', 'Pabillar', 'Female', 'Finance Division', 'Senior Corporate Accountant A', 'MEM', 'Loradel_Pabillar_esignature.png', 'Loradel_Pabillar_avatar.jpg', '', 'ppa_pabillar', '$2y$10$ps0VJwrC2T3ONAo2ARDmN.W5FvVlBWEdDRkghYEiVljsHDrCj2skK', 1, '2024-09-26 07:16:23', '2024-09-26 07:16:23'),
(56, 'Locyl', 'L', 'Petallo', 'Female', 'Administrative Division', 'Utility Worker', 'MEM', 'Locyl_Petallo_esignature.png', 'Locyl_Petallo_avatar.jpg', '', 'ppa_locyl', '$2y$10$HAlUsnr4SPlXILcAc19cledqK7FO1rg5O2jQbe5/yzQOdVVMkzNqa', 1, '2024-09-26 07:18:42', '2024-09-26 07:18:42'),
(57, 'Gemma', 'P', 'Pontillo', 'Female', 'Finance Division', 'Senior Corporate Accounts Analyst', 'MEM', 'Gemma_Pontillo_esignature.png', 'Gemma_Pontillo_avatar.jpg', '', 'ppa_gemma', '$2y$10$7SVqquZBoHP8LasODhB/jeaHCkI8p74LfIid0/cKZFmU1Wa1lY3n.', 1, '2024-09-26 07:20:08', '2024-09-26 07:20:08'),
(58, 'Tito', 'F', 'Pontillo, Jr', 'Male', 'Port Police Division', 'Civil Security Officer A', 'MEM', 'Tito_Pontillo, Jr_esignature.png', 'Tito_Pontillo, Jr_avatar.jpg', '', 'ppa_tito', '$2y$10$pdkU6SgRXuGvJyCRttbBFOn7mb.tVdvFQqH.t1W0l/.l.M64d65RS', 1, '2024-09-26 07:22:09', '2024-09-26 07:22:09'),
(59, 'Ronan', 'A', 'Quiapo', 'Male', 'Port Police Division', 'Port Operations Analyst A', 'MEM', 'Ronan_Quiapo_esignature.png', 'Ronan_Quiapo_avatar.jpg', '', 'ppa_quiapo', '$2y$10$2ddpO80HAhAEL4X0AoRRr.XcKC0DeKENogz6ci/gXo2G9saOCbBjW', 1, '2024-09-26 07:23:19', '2024-09-26 07:23:19'),
(60, 'Elva', 'V', 'Real', 'Female', 'Office of the Port Manager', 'Business Development/Marketing Officer A', 'MEM', 'Elva_Real_esignature.png', 'Elva_Real_avatar.jpg', '', 'ppa_elva', '$2y$10$FYiTKUHj0Vr2ktBMBrFrOefyBiARI7U5pk15MgIS7Dqr8cG44Taau', 1, '2024-09-26 07:24:19', '2024-09-26 07:24:19'),
(61, 'Noel', 'G', 'Rosero', 'Male', 'Administrative Division', 'Senior Building Electrician B', 'MEM', 'Noel_Rosero_esignature.png', 'Noel_Rosero_avatar.jpg', '', 'ppa_rosero', '$2y$10$L/50IwNwJhugn26YAjxeyu2TFuKhPnEHKGxuGwlH3J8.e5cid9HZW', 1, '2024-09-26 07:26:00', '2024-09-26 07:26:00'),
(62, 'J. Wenceslao', 'S', 'Rosete', 'Male', 'Port Police Division', 'Civil Security Officer A (Senior Port Police Inspector)', 'MEM', 'J._Wenceslao_Rosete_esignature.png', 'J._Wenceslao_Rosete_avatar.jpg', '', 'ppa_jrosete', '$2y$10$HokJ.43bnWUsfkck1CULxe5SehJAF78Mps9XFZlA./aUCSmyYqBhG', 1, '2024-09-26 07:28:33', '2024-09-26 07:28:33'),
(63, 'Rey', 'Y', 'Salaan', 'Male', 'Port Service Division', 'Terminal Operations Officer A', 'MEM', 'Rey_Salaan_esignature.png', 'Rey_Salaan_avatar.jpg', '', 'ppa_salaan', '$2y$10$IOnOBnw6mXuDqKUqPO5MWuzOMmsJGeBg6qMUfOCNiTUKvJevKAvKa', 1, '2024-09-26 07:31:29', '2024-09-26 07:31:29'),
(64, 'Raymart', 'E', 'Ruelan', 'Male', 'Administrative Division', 'Clerk Processor A', 'HACK, MEM', 'Raymart_Ruelan_1727336396_esig.png', 'Raymart_Ruelan_avatar.jpg', '', 'ppa_mart', '$2y$10$QRkDdpaNyDu/uGRY0ONblebl4ZMb.DAHEiuLYP3YqwT9JhkbMxNKq', 1, '2024-09-26 07:33:42', '2024-09-26 07:39:56'),
(65, 'Jeffrey Datu', 'N', 'Islao', 'Male', 'Administrative Division', 'Computer Maintenance Technologist I', 'MEM, HACK', 'Jeffrey_Silao_esignature.png', 'Jeffrey_Silao_avatar.jpg', 'JOMS-202600065', 'ppa_silao', '$2y$10$s0aKPRkZ9xQ/CjYxxwWwsuXY/bPKMQpnQ/s4nt6F0RDpZSgqlWDjy', 2, '2024-09-26 07:41:45', '2026-05-19 01:20:02'),
(66, 'Jolito', 'S', 'Sepio', 'Male', 'Engineering Service Division', 'Mason ll (A)', 'MEM', 'Jolito_Sepio_esignature.png', 'Jolito_Sepio_avatar.jpg', '', 'ppa_sepio', '$2y$10$QD4j8onzgzmmWJP8bNbZFeYVlomRcQ1dBq405kC3SMwY1LXfwK81.', 1, '2024-09-26 07:42:43', '2024-09-26 07:42:43'),
(67, 'Abigail Rose', 'N', 'Suangco', 'Female', 'Administrative Division', 'Human Resource Management Officer II', 'MEM', 'Abigail_Rose_Suangco_esignature.png', 'Abigail_Rose_Suangco_avatar.jpg', '', 'ppa_abby', '$2y$10$v27ACsNuuU3dkt8l4QZEf.ZnVIevJPoRBzK8F.zWYYKa5koiMZ6FS', 1, '2024-09-26 07:44:05', '2024-09-26 07:44:05'),
(68, 'Daryl', 'T', 'Sumanoy', 'Male', 'Administrative Division', 'Driver-Mechanic B', 'AUV, AP', 'Daryl_Sumanoy_esignature.png', 'Daryl_Sumanoy_avatar.jpg', '', 'ppa_daryl', '$2y$10$lTXHnNub3qT1lNsJZvryU.Xs1x2nAsL3taO/5Lri4wbSAYD.XaQ8K', 1, '2024-09-26 07:45:24', '2026-05-08 05:57:44'),
(69, 'Japheth', 'T', 'Sumingit', 'Male', 'Port Police Division', 'Industrial Security Officer (Port Police Officer I)', 'MEM', 'Japheth_Sumingit_esignature.png', 'Japheth_Sumingit_avatar.jpg', '', 'ppa_sumingit', '$2y$10$uXi6pwZCPWgCYXCm9bve5.yWkSIeYdf/x10CRuqszjhcR2KIldgri', 1, '2024-09-26 07:46:30', '2024-09-26 07:46:30'),
(70, 'Lorgie Mae', 'A', 'Tumbagahan', 'Female', 'Port Service Division', 'Statistician A', 'MEM', 'Lorgie_Mae_Tumbagahan_esignature.png', 'Lorgie_Mae_Tumbagahan_avatar.jpg', '', 'ppa_lorgie', '$2y$10$SUdPVo.jbJv6DX/0GzPm/./TKPShTQkBwYUcoX.Yl7b6/xkelZk7O', 1, '2024-09-26 07:47:37', '2024-09-26 07:47:37'),
(71, 'John', 'A', 'Doe', 'Male', 'Administrative Division', 'Flower Girl Haha', 'MEM', 'John_Doe_1767937898_esig.png', 'John_Doe_1767937168_avatar.jpg', '', 'ppa_turla', '$2y$10$uqJORqxMW.y6F9Z6ncEICe/FBNiX/VMpkxUKQOEeG50D1fxvyFG1q', 2, '2024-09-26 07:48:34', '2026-01-09 05:51:38'),
(72, 'Queen Blaire', 'B', 'Unabia', 'Female', 'Port Police Division', 'Industrial Security Officer (Port Police Officer I)', 'MEM', 'Queen_Blaire_Unabia_esignature.png', 'Queen_Blaire_Unabia_avatar.jpg', '', 'ppa_unabia', '$2y$10$wMQuvGqaPKMdTlNUKRL3s.3IP4nabTQx8/ipNv/rvtF/xEYm.96na', 1, '2024-09-26 07:49:40', '2024-09-26 07:49:40'),
(73, 'Judylyn', 'V', 'Velez', 'Female', 'Finance Division', 'Data Encoder lll', 'MEM', 'Judylyn_Velez_esignature.png', 'Judylyn_Velez_avatar.jpg', '', 'ppa_judylyn', '$2y$10$wAH.xsuQiPZOdtRztiHg4.akZ4HSDTnAsncwAWi3ACOgmUlstv.6W', 1, '2024-09-26 07:50:42', '2024-09-26 07:50:42'),
(74, 'Julito', 'S', 'Villacorte', 'Male', 'Engineering Service Division', 'Senior Carpenter', 'MEM', 'Julito_Villacorte_esignature.png', 'Julito_Villacorte_avatar.jpg', '', 'ppa_julito', '$2y$10$qDNen/PZa59rpW6KpLziWukGhPMZLgL.ix/6AB6L1gt.HNLNzM0Z2', 1, '2024-09-26 07:51:38', '2024-09-26 07:51:38'),
(75, 'Ricky', 'M', 'Villaver', 'Male', 'Finance Division', 'Data Encoder lll', 'MEM', 'Ricky_Villaver_esignature.png', 'Ricky_Villaver_avatar.jpg', '', 'ppa_ricky', '$2y$10$0TPybFHXK2GpqJ1yPTjTYeINkLRJTHtj2afrO2uU9F6YsSNAQ3VsC', 1, '2024-09-26 07:52:39', '2024-09-26 07:52:39'),
(76, 'Naomie', 'D', 'Zalsos', 'Female', 'Administrative Division', 'Acting Adminstrative Division Manager', 'AM', 'Naomie_Zalsos_esignature.png', 'Naomie_Zalsos_avatar.jpg', 'JOMS-202600076', 'ppa_naomie', '$2y$10$oUKjXITn3OXwE46UNrWn7esQmV04qgoHw3tg9FQ/GIWPPcHXeEGgS', 1, '2024-09-26 07:53:51', '2026-06-15 08:11:39'),
(78, 'John', 'A', 'Doe', 'Male', 'Administrative Division', 'Tester User', 'MEM', 'John_Doe_1749534126_esig.png', 'John_Doe_1773381189_avatar.jpg', '', 'johnDoe', '$2y$10$Qa/rFMdp7kuW2MtD713b8Ow.Jd5U7yz2R58eWhBUx2Nc5mtnBmz46', 1, '2025-06-10 05:39:45', '2026-03-13 05:53:09'),
(79, 'Zackiee Mio', 'A', 'Sermon', 'Male', 'Office of the Port Manager', 'Mobile Dev Tester II', 'AUS', 'Zackiee_Mio_Sermon_1778903617_esig.png', 'Zackiee_Mio_Sermon_1778900915_avatar.jpg', 'JOMS-202600079', 'ppa_tester', '$2y$10$hhS2D2vmrDuIvvU/Khh.RuEqnhGSiqSRNnQju0ZSMa1VKOPqkWFtO', 2, '2025-08-14 08:17:30', '2026-05-28 02:30:51'),
(80, 'Main', '-', 'Gate', 'Male', 'Port Police Division', 'GATE', 'SEC', 'Main_Gate_esignature.png', 'Main_Gate_avatar.jpg', '', 'maingate', '$2y$10$HeaZMmstrRd0NKmI1A9uNO8KZ0P2hq4POT5pvg7HFV5XyExRTbInC', 1, '2026-01-30 03:04:46', '2026-01-30 03:26:16'),
(81, 'Dexter', 'D', 'Dela Cruz', 'Male', 'Administrative Division', 'Joker V', 'MEM, AUS, AP', 'Dexter_Dela Cruz_esignature.png', 'Dexter_Dela Cruz_avatar.jpg', '', 'ppa_dexter', '$2y$10$i5axUs1xvqGfhcnKvOKSX.HEj3CtS5MmW179orsUcfaijOb80uZLK', 1, '2026-03-14 01:44:53', '2026-03-31 03:45:09'),
(82, 'Juan', 'D', 'Cruz', 'Male', 'Office of the Port Manager', 'Joker II', 'AUF', 'Juan_Cruz_1773472245_esig.png', 'Juan_Cruz_1773471977_avatar.jpg', '', 'ppa_juan', '$2y$10$eu6DNCE4YOALUH3CrUVUG.lhe6kG0rW2vo1lqu7iPwAXTY1l5KyMS', 1, '2026-03-14 06:11:06', '2026-03-27 02:29:37'),
(83, 'Juan', NULL, 'Dela cruz', 'Male', 'Administrative Division', 'Joker I', 'MEM', 'Juan_Dela cruz_esignature.png', 'Juan_Dela cruz_avatar.jpg', NULL, 'zackmio2024', '$2y$10$ogUD4c5kHdEfZgFEGfMONO86LooUDaIEa.NczWzUz06TcuL0gQnY2', 2, '2026-05-13 08:01:39', '2026-05-13 08:01:39'),
(85, 'Juan', NULL, 'Cruz', 'Female', 'Administrative Division', 'Joker I', 'MEM', 'Juan_Cruz_esignature.png', 'Juan_Cruz_avatar.jpg', 'JOMS-202600085', 'jaun@2026', '$2y$10$Ep7XM9Sy2GGfW8GKk4Qib.bmmHXsHjzsP.TW6cMBIqpj0ecQlSjli', 2, '2026-05-19 02:08:23', '2026-05-19 02:08:23'),
(86, 'John', NULL, 'Doe', 'Male', 'Finance Division', 'Data Encoder lll', 'MEM', 'John_Doe_esignature.png', 'John_Doe_avatar.jpg', 'JOMS-202600086', 'jandoe1234', '$2y$10$f9KwRwkUwba/T3pl3InZLeIGC6jAf/p6hy9ZeRsUi0BPfvWjOpRhy', 2, '2026-05-19 06:57:35', '2026-05-19 06:57:35'),
(87, 'Jane', NULL, 'Doe', 'Female', 'Office of the Port Manager', 'Joker I', 'MEM', 'Jane_Doe_esignature.png', 'Jane_Doe_avatar.jpg', 'JOMS-202600087', 'ppa_nogas', '$2y$10$abfCCOX4ktbwAYSIGBUpVead6vSQW1ABwLzLlNEEegjQXOzxVnypS', 0, '2026-05-19 07:01:28', '2026-05-19 07:02:02');

-- --------------------------------------------------------

--
-- Table structure for table `superadminsettings`
--

CREATE TABLE `superadminsettings` (
  `super_id` int(11) NOT NULL,
  `key_name` varchar(255) NOT NULL,
  `key_value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `superadminsettings`
--

INSERT INTO `superadminsettings` (`super_id`, `key_name`, `key_value`) VALUES
(1, 'maintenance_mode', 'off');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcement`
--
ALTER TABLE `announcement`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `assign_personnel`
--
ALTER TABLE `assign_personnel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `form_request_tracker`
--
ALTER TABLE `form_request_tracker`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `joms_facility_venue`
--
ALTER TABLE `joms_facility_venue`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `joms_inspection_form`
--
ALTER TABLE `joms_inspection_form`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `joms_vehicle_slip_form`
--
ALTER TABLE `joms_vehicle_slip_form`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `joms_vehicle_type`
--
ALTER TABLE `joms_vehicle_type`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `ppa_security`
--
ALTER TABLE `ppa_security`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ppa_user`
--
ALTER TABLE `ppa_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `superadminsettings`
--
ALTER TABLE `superadminsettings`
  ADD PRIMARY KEY (`super_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcement`
--
ALTER TABLE `announcement`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `assign_personnel`
--
ALTER TABLE `assign_personnel`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `form_request_tracker`
--
ALTER TABLE `form_request_tracker`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `joms_facility_venue`
--
ALTER TABLE `joms_facility_venue`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `joms_inspection_form`
--
ALTER TABLE `joms_inspection_form`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `joms_vehicle_slip_form`
--
ALTER TABLE `joms_vehicle_slip_form`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `joms_vehicle_type`
--
ALTER TABLE `joms_vehicle_type`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=146;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `ppa_security`
--
ALTER TABLE `ppa_security`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=487;

--
-- AUTO_INCREMENT for table `ppa_user`
--
ALTER TABLE `ppa_user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT for table `superadminsettings`
--
ALTER TABLE `superadminsettings`
  MODIFY `super_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
