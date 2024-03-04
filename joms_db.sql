-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 04, 2024 at 08:19 AM
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
-- Database: `joms_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `assign_personnels`
--

CREATE TABLE `assign_personnels` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `type_of_personnel` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `assign_personnels`
--

INSERT INTO `assign_personnels` (`id`, `user_id`, `type_of_personnel`, `created_at`, `updated_at`) VALUES
(1, 5, 'IT Service', '2023-11-07 19:37:03', '2023-11-07 19:37:03'),
(2, 6, 'Driver/Mechanic', '2023-11-16 21:54:14', '2023-11-16 21:54:14'),
(3, 8, 'Driver/Mechanic', '2023-12-19 23:15:37', '2023-12-19 23:15:37'),
(4, 9, 'Driver/Mechanic', '2023-12-19 23:18:40', '2023-12-19 23:18:40'),
(5, 10, 'Driver/Mechanic', '2023-12-19 23:22:56', '2023-12-19 23:22:56'),
(6, 11, 'Driver/Mechanic', '2023-12-19 23:24:50', '2023-12-19 23:24:50'),
(7, 12, 'Driver/Mechanic', '2023-12-19 23:29:14', '2023-12-19 23:29:14'),
(8, 13, 'Driver/Mechanic', '2023-12-19 23:33:39', '2023-12-19 23:33:39'),
(12, 17, 'Manager/Finance Division', '2024-01-21 21:49:43', '2024-01-21 21:49:43'),
(13, 21, 'Supervisor/Office of the Port Manager', '2024-01-21 21:50:13', '2024-01-21 21:50:13'),
(14, 19, 'Manager/Engineering Services Division', '2024-01-21 21:51:16', '2024-01-21 21:51:16'),
(15, 20, 'Manager/Port Police Division', '2024-01-21 21:51:50', '2024-01-21 21:51:50'),
(16, 22, 'Manager/Port Services Division', '2024-01-21 21:53:05', '2024-01-21 21:53:05'),
(18, 3, 'Supervisor/Administrative Division', '2024-01-21 21:54:47', '2024-01-21 21:54:47'),
(20, 14, 'Manager/TMO-TUBOD', '2024-01-21 22:06:16', '2024-01-21 22:06:16'),
(25, 20, 'Driver/Mechanic', '2024-02-21 02:50:24', '2024-02-21 02:50:24'),
(26, 24, 'Driver/Mechanic', '2024-02-21 03:04:51', '2024-02-21 03:04:51');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_form`
--

CREATE TABLE `equipment_form` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `type_of_equipment` varchar(255) NOT NULL,
  `date_request` date NOT NULL,
  `title_of_activity` varchar(255) NOT NULL,
  `date_of_activity` date NOT NULL,
  `time_start` time NOT NULL,
  `time_end` time NOT NULL,
  `instructions` varchar(1000) DEFAULT NULL,
  `driver` varchar(255) DEFAULT NULL,
  `operator` varchar(255) DEFAULT NULL,
  `rescue_members` varchar(1000) DEFAULT NULL,
  `opr` varchar(1000) DEFAULT NULL,
  `division_manager_id` smallint(6) NOT NULL,
  `division_manager_approval` tinyint(1) NOT NULL DEFAULT 0,
  `admin_manager_approval` tinyint(1) NOT NULL DEFAULT 0,
  `harbor_master_approval` tinyint(1) NOT NULL DEFAULT 0,
  `port_manager_approval` tinyint(1) NOT NULL DEFAULT 0,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `equipment_form`
--

INSERT INTO `equipment_form` (`id`, `user_id`, `type_of_equipment`, `date_request`, `title_of_activity`, `date_of_activity`, `time_start`, `time_end`, `instructions`, `driver`, `operator`, `rescue_members`, `opr`, `division_manager_id`, `division_manager_approval`, `admin_manager_approval`, `harbor_master_approval`, `port_manager_approval`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Firetruck', '2024-03-04', 'Test Activity for Firetruck', '2024-03-08', '13:00:00', '17:00:00', NULL, NULL, NULL, NULL, NULL, 3, 0, 0, 0, 0, 0, '2024-03-04 06:20:35', '2024-03-04 06:20:35'),
(2, 1, 'Firetruck', '2024-03-04', 'Test Activity', '2024-03-08', '10:00:00', '14:00:00', NULL, NULL, NULL, NULL, NULL, 3, 0, 0, 0, 0, 0, '2024-03-04 06:48:28', '2024-03-04 06:48:28');

-- --------------------------------------------------------

--
-- Table structure for table `facility`
--

CREATE TABLE `facility` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `date_requested` date NOT NULL,
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
  `specify` varchar(255) DEFAULT NULL,
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
-- Dumping data for table `facility`
--

INSERT INTO `facility` (`id`, `user_id`, `date_requested`, `request_office`, `title_of_activity`, `date_start`, `time_start`, `date_end`, `time_end`, `mph`, `conference`, `dorm`, `other`, `table`, `no_table`, `chair`, `no_chair`, `microphone`, `no_microphone`, `others`, `specify`, `projector`, `projector_screen`, `document_camera`, `laptop`, `television`, `sound_system`, `videoke`, `name_male`, `name_female`, `other_details`, `admin_approval`, `date_approve`, `obr_instruct`, `obr_comment`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 1, '2024-02-28', 'Admin', 'Test Activity', '2024-02-29', '08:00:00', '2024-02-29', '17:00:00', 1, 0, 1, 0, 1, 10, 1, 50, 1, 6, 0, NULL, 1, 0, 0, 0, 0, 0, 0, '1. Jose Miguel Santos\n2. Andres Reyes\n3. Juanito Cruz\n4. Eduardo Rivera\n5. Marcelo Garcia\n6. Lorenzo Martinez', '1. Maria Gonzales\n2. Gabriela Dela Cruz\n3. Sofia Ramos\n4. Isabella Hernandez\n5. Camila Santos\n6. Angela Castro', 'Test', 3, '2024-02-29', 'None', NULL, 'Disapproved', '2024-02-28 03:34:24', '2024-02-29 08:00:01'),
(2, 3, '2024-02-28', 'Admin', 'Test Activity', '2024-03-07', '10:00:00', '2024-03-07', '17:00:00', 1, 0, 0, 0, 1, 10, 1, 50, 1, 4, 0, NULL, 0, 0, 1, 1, 1, 0, 0, 'N/A', 'N/A', 'N/A', 1, '2024-02-29', 'test', 'None', 'Closed', '2024-02-28 06:30:53', '2024-02-29 09:02:59'),
(3, 7, '2024-02-28', 'OPM', 'Test Activity', '2024-03-04', '08:00:00', '2024-03-04', '12:00:00', 0, 1, 0, 0, 0, NULL, 1, 10, 1, 10, 0, NULL, 0, 0, 1, 1, 0, 0, 0, 'N/A', 'N/A', 'N/A', 1, '2024-02-29', 'None', 'None', 'Closed', '2024-02-28 06:40:27', '2024-02-29 09:03:20'),
(4, 4, '2024-02-28', 'Admin', 'Test Activity', '2024-03-01', '12:00:00', '2024-03-01', '15:00:00', 0, 0, 1, 0, 0, NULL, 0, NULL, 0, NULL, 0, NULL, 0, 0, 0, 0, 0, 0, 0, '1. Jose Miguel Santos\n2. Andres Reyes\n3. Juanito Cruz', '1. Maria Gonzales\n2. Gabriela Dela Cruz\n3. Sofia Ramos', NULL, 1, '2024-02-29', 'None', 'None', 'Closed', '2024-02-28 06:46:42', '2024-02-29 09:04:00'),
(5, 2, '2024-02-28', 'Admin', 'Test Activity', '2024-03-06', '17:00:00', '2024-03-06', '20:00:00', 1, 0, 0, 0, 0, NULL, 1, 80, 1, 3, 0, NULL, 1, 0, 0, 0, 0, 0, 0, 'N/A', 'N/A', 'N/A', 1, '2024-02-29', 'This is test only', 'test', 'Closed', '2024-02-28 07:07:52', '2024-02-29 09:04:38'),
(6, 2, '2024-02-29', 'Admin', 'Test Activity', '2024-03-08', '13:00:00', '2024-03-08', '15:00:00', 0, 1, 0, 0, 0, NULL, 1, 10, 1, 10, 0, NULL, 0, 0, 1, 0, 0, 0, 0, 'N/A', 'N/A', 'N/A', 1, '2024-02-29', 'None', 'teset', 'Closed', '2024-02-29 08:14:15', '2024-02-29 09:05:00'),
(7, 20, '2024-03-01', 'PPD', 'Test Activity', '2024-03-14', '08:00:00', '2024-03-14', '12:00:00', 0, 1, 0, 0, 0, NULL, 1, 25, 1, 25, 0, NULL, 0, 0, 1, 1, 0, 0, 0, 'N/A', 'N/A', 'N/A', 1, '2024-03-01', 'None', 'None', 'Closed', '2024-03-01 02:13:18', '2024-03-01 02:26:54');

-- --------------------------------------------------------

--
-- Table structure for table `inspection_form_admin`
--

CREATE TABLE `inspection_form_admin` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `inspection__form_id` bigint(20) UNSIGNED NOT NULL,
  `date_of_filling` date NOT NULL,
  `date_of_last_repair` date DEFAULT NULL,
  `nature_of_last_repair` varchar(255) DEFAULT NULL,
  `assign_personnel` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inspection_form_admin`
--

INSERT INTO `inspection_form_admin` (`id`, `inspection__form_id`, `date_of_filling`, `date_of_last_repair`, `nature_of_last_repair`, `assign_personnel`, `created_at`, `updated_at`) VALUES
(1, 4, '2024-02-29', NULL, NULL, 8, '2024-02-29 00:13:26', '2024-02-29 00:13:26'),
(2, 5, '2024-02-29', NULL, NULL, 11, '2024-02-29 00:27:55', '2024-02-29 00:27:55'),
(3, 3, '2024-02-29', NULL, NULL, 5, '2024-02-29 00:28:27', '2024-02-29 00:28:27'),
(4, 2, '2024-02-29', '2024-02-07', 'This is test only', 5, '2024-02-29 00:31:08', '2024-02-29 00:31:08'),
(5, 7, '2024-03-01', NULL, NULL, 5, '2024-03-01 01:47:45', '2024-03-01 01:47:45');

-- --------------------------------------------------------

--
-- Table structure for table `inspection__forms`
--

CREATE TABLE `inspection__forms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `date_of_request` date NOT NULL,
  `property_number` varchar(255) NOT NULL,
  `acq_date` date NOT NULL,
  `acq_cost` varchar(255) NOT NULL,
  `brand_model` varchar(255) NOT NULL,
  `serial_engine_no` varchar(255) NOT NULL,
  `type_of_property` varchar(255) NOT NULL,
  `property_other_specific` varchar(255) DEFAULT NULL,
  `property_description` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `complain` varchar(255) NOT NULL,
  `supervisor_name` smallint(6) NOT NULL,
  `supervisor_approval` tinyint(1) NOT NULL DEFAULT 0,
  `admin_approval` tinyint(1) NOT NULL DEFAULT 0,
  `inspector_status` int(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inspection__forms`
--

INSERT INTO `inspection__forms` (`id`, `user_id`, `date_of_request`, `property_number`, `acq_date`, `acq_cost`, `brand_model`, `serial_engine_no`, `type_of_property`, `property_other_specific`, `property_description`, `location`, `complain`, `supervisor_name`, `supervisor_approval`, `admin_approval`, `inspector_status`, `created_at`, `updated_at`) VALUES
(1, 1, '2024-02-28', 'Test Property Number', '2024-02-13', '10000', 'Test Brand Model', 'Test Serial Number', 'IT Equipment & Related Materials', NULL, 'Test Description', 'Admin', 'This is Zack-Mio', 3, 2, 0, 0, '2024-02-28 08:37:00', '2024-02-28 08:59:20'),
(2, 21, '2024-02-28', 'Test Property Number', '2024-02-02', '20000', 'Test Brand Model', 'Test Serial Number', 'IT Equipment & Related Materials', NULL, 'Test Description', 'OPM', 'This is maam Eve', 21, 1, 1, 1, '2024-02-28 08:38:19', '2024-02-29 05:33:11'),
(3, 7, '2024-02-28', 'Test Property Number', '2024-02-15', '30000', 'Test Brand Model', 'Test Serial Number', 'IT Equipment & Related Materials', NULL, 'Test Description', 'OPM', 'This is sir Jong', 7, 1, 1, 1, '2024-02-28 08:39:06', '2024-02-29 05:33:26'),
(4, 4, '2024-02-28', 'Test Property Number', '2024-02-08', '40000', 'Test Brand Model', 'Test Serial Number', 'Vehicle Supplies & Materials', NULL, 'Test Description', 'Admin', 'This is maam Sue', 3, 1, 1, 1, '2024-02-28 08:39:48', '2024-02-29 05:35:00'),
(5, 2, '2024-02-28', 'Test Property Number', '2024-02-15', '50000', 'Test Brand Model', 'Test Serial Number', 'Others', 'Test', 'Test Description', 'Admin', 'This is maam Daisy', 2, 1, 1, 1, '2024-02-28 08:40:43', '2024-02-29 05:36:13'),
(6, 6, '2024-02-29', 'Test Property Number', '2024-02-08', '50000', 'Test Brand Model', 'Test Serial Number', 'Vehicle Supplies & Materials', NULL, 'Test Description', 'Admin', 'This is Daryl Test', 3, 2, 0, 0, '2024-02-29 02:43:19', '2024-02-29 03:21:46'),
(7, 1, '2024-03-01', 'Test Property Number', '2024-02-25', '50000', 'Test Brand Model', 'Test Serial Number', 'IT Equipment & Related Materials', NULL, 'Test Description', 'Admin', 'This is zack another test', 3, 1, 1, 1, '2024-03-01 01:04:37', '2024-03-01 02:06:44');

-- --------------------------------------------------------

--
-- Table structure for table `inspector__forms`
--

CREATE TABLE `inspector__forms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `inspection__form_id` int(11) NOT NULL,
  `before_repair_date` date NOT NULL,
  `findings` varchar(255) NOT NULL,
  `recommendations` varchar(255) NOT NULL,
  `after_reapir_date` date DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `close` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inspector__forms`
--

INSERT INTO `inspector__forms` (`id`, `inspection__form_id`, `before_repair_date`, `findings`, `recommendations`, `after_reapir_date`, `remarks`, `close`, `created_at`, `updated_at`) VALUES
(1, 4, '2024-02-29', 'rewr', 'rwer', '2024-02-29', 'test', 2, '2024-02-29 00:13:26', '2024-02-29 05:35:00'),
(2, 5, '2024-02-29', 'th', 'fh', '2024-02-29', 'gf', 2, '2024-02-29 00:27:55', '2024-02-29 05:36:13'),
(3, 3, '2024-02-29', 'Test', 'Test', '2024-02-29', 'Test', 1, '2024-02-29 00:28:27', '2024-02-29 05:33:31'),
(4, 2, '2024-02-29', 'Test', 'test', '2024-02-29', 'Test', 1, '2024-02-29 00:31:08', '2024-02-29 07:10:40'),
(5, 7, '2024-03-01', 'test', 'test', '2024-03-01', 'test', 1, '2024-03-01 01:47:45', '2024-03-01 02:06:58');

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
(2, '2023_08_22_030500_create_users_table', 1),
(3, '2023_08_22_053132_create_p_p_a_users_table', 1),
(4, '2023_09_11_010239_create_inspection__forms_table', 1),
(5, '2023_09_19_041010_create_technical_personnel_table', 1),
(6, '2023_09_19_074453_create_inspection_form_admin_table', 1),
(7, '2023_10_05_053219_create_notifications_table', 1),
(8, '2023_10_12_053100_create_inspector_form_table', 1),
(9, '2023_11_06_080540_create_request_facility_table', 1),
(10, '2023_11_09_071634_create_facility_mph', 2),
(11, '2023_11_14_012612_create_facility_conference_table', 3),
(12, '2023_11_15_053249_create_facility_dormitory_table', 4),
(13, '2023_12_21_021016_create_vehicle_slip_table', 5),
(15, '2024_01_12_011625_create_equipment_form_table', 6),
(18, '2024_01_30_085007_create_facility_form_table', 7),
(23, '2024_01_30_085459_create_facility_room_table', 8),
(24, '2024_01_30_085548_create_facility_dorm_table', 8),
(25, '2024_01_31_081222_create_facility_table', 9),
(26, '2024_02_14_154226_create_notification_table', 10);

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
(2, 'App\\Models\\PPAUser', 2, 'main', '12d770fc15d5846c0c159da6dc7be58b3a0aec5a7766f6f4c65cb63cd69a7da1', '[\"*\"]', NULL, NULL, '2023-11-07 19:32:06', '2023-11-07 19:32:06'),
(3, 'App\\Models\\PPAUser', 3, 'main', '2e9ef293779547696bd768fa0a2b0910110d90312508a39b8c86fb7cec530d7d', '[\"*\"]', NULL, NULL, '2023-11-07 19:33:24', '2023-11-07 19:33:24'),
(4, 'App\\Models\\PPAUser', 4, 'main', '41aad03621922d57ac8dc12c2281bc799525b6822564b5d4260ec9eb5c389748', '[\"*\"]', NULL, NULL, '2023-11-07 19:34:16', '2023-11-07 19:34:16'),
(5, 'App\\Models\\PPAUser', 5, 'main', 'ffbadb9b85acac319c47b1ed35273a63a9b0ec77dffb06ec90bdaba30bdfd1ef', '[\"*\"]', NULL, NULL, '2023-11-07 19:36:15', '2023-11-07 19:36:15'),
(32, 'App\\Models\\PPAUser', 6, 'main', 'e0d66c76d8ce125ab235f255b1acdf202d7907016a6c45701037e36326059d57', '[\"*\"]', NULL, NULL, '2023-11-16 21:42:36', '2023-11-16 21:42:36'),
(46, 'App\\Models\\PPAUser', 7, 'main', '408e710df3d6bb905b350e4244ff1d8d2d2b5bc550fc4ed3a52b1052478747c0', '[\"*\"]', NULL, NULL, '2023-11-21 01:05:37', '2023-11-21 01:05:37'),
(49, 'App\\Models\\PPAUser', 1, 'main', 'e93f8fc6cb262a4f1491298eb1b2c1a7e29e539e023e22ab73fab70a0797bcf9', '[\"*\"]', '2023-11-27 21:44:25', NULL, '2023-11-27 18:31:16', '2023-11-27 21:44:25'),
(56, 'App\\Models\\PPAUser', 1, 'main', '82c60d1cd01161c670eb8247dab0a79e522f00d622d3a77d602b136dc09cee73', '[\"*\"]', '2023-11-28 16:40:13', NULL, '2023-11-28 16:37:28', '2023-11-28 16:40:13'),
(63, 'App\\Models\\PPAUser', 6, 'main', '9a441fbfa14c096395d5e9bdcb38e2ec139119d3e24aeddf76fb542fc2efe602', '[\"*\"]', '2023-11-28 18:56:22', NULL, '2023-11-28 17:59:34', '2023-11-28 18:56:22'),
(96, 'App\\Models\\PPAUser', 5, 'main', 'a55aa1dc03c04e6f17853038b5b21961f20cc5a57d152edabdcff5e22cb63b88', '[\"*\"]', '2023-11-30 22:45:38', NULL, '2023-11-30 22:05:26', '2023-11-30 22:45:38'),
(114, 'App\\Models\\PPAUser', 5, 'main', 'c1825bc139dda96f4071a9b6f569aeb30dfcf2be2870772cb6292604cb8acff3', '[\"*\"]', '2023-12-07 00:10:11', NULL, '2023-12-06 23:24:49', '2023-12-07 00:10:11'),
(126, 'App\\Models\\PPAUser', 1, 'main', '0db076b0bdecca17dcf3b0633ac3e780629efd4f3d2a7fe001ae2872a5dd89e5', '[\"*\"]', '2023-12-12 20:35:35', NULL, '2023-12-11 23:08:36', '2023-12-12 20:35:35'),
(145, 'App\\Models\\PPAUser', 8, 'main', '0a8834407f47d0805c7503aa3ae8f437a08efd3289554b92f500d81b4ac827f7', '[\"*\"]', NULL, NULL, '2023-12-19 23:15:01', '2023-12-19 23:15:01'),
(146, 'App\\Models\\PPAUser', 9, 'main', '3638b2b12f082245c6a5d5b5b4cb5dd1ab6b5bb7fb564348535cc319e22f2059', '[\"*\"]', NULL, NULL, '2023-12-19 23:18:14', '2023-12-19 23:18:14'),
(147, 'App\\Models\\PPAUser', 10, 'main', '4437af3595bd41a3a860594c5746904a26b32c6fd15397d127e0ae7bfb949e9c', '[\"*\"]', NULL, NULL, '2023-12-19 23:22:31', '2023-12-19 23:22:31'),
(148, 'App\\Models\\PPAUser', 11, 'main', '95fbebe73d30cb5ed6c50837a023481377dfa048077c80449715110a9e3ea0cf', '[\"*\"]', NULL, NULL, '2023-12-19 23:24:33', '2023-12-19 23:24:33'),
(149, 'App\\Models\\PPAUser', 12, 'main', 'd8f8d634495a0dd8aceecd315e90f8bec4b05de74dae38e03f205911689a980f', '[\"*\"]', NULL, NULL, '2023-12-19 23:28:58', '2023-12-19 23:28:58'),
(150, 'App\\Models\\PPAUser', 13, 'main', '78fe2a7bb29bc2fe0eb08e38a813544d11d0df43fa296ba9c07ec4890f03b0fe', '[\"*\"]', NULL, NULL, '2023-12-19 23:33:15', '2023-12-19 23:33:15'),
(151, 'App\\Models\\PPAUser', 14, 'main', '145a249273a9904f82b3580bac9ff8c9dc6f40f2299b363232085d9d7ae10b7e', '[\"*\"]', NULL, NULL, '2023-12-19 23:35:43', '2023-12-19 23:35:43'),
(152, 'App\\Models\\PPAUser', 15, 'main', '6091f067312c2ca0629baef22727326780b1653fbec2549455fa6f3e94bf3fce', '[\"*\"]', NULL, NULL, '2023-12-19 23:43:01', '2023-12-19 23:43:01'),
(173, 'App\\Models\\PPAUser', 16, 'main', 'f323c555030257eb768a6da445912ff64c35e720895fcb6b6742321f98cac2c9', '[\"*\"]', NULL, NULL, '2023-12-26 17:24:46', '2023-12-26 17:24:46'),
(219, 'App\\Models\\PPAUser', 2, 'main', 'bbebebaf8fc2a0851e4641203c79bc7181a29cc082daf5c2f30511d4cda84214', '[\"*\"]', '2024-01-04 22:49:19', NULL, '2024-01-02 22:34:23', '2024-01-04 22:49:19'),
(233, 'App\\Models\\PPAUser', 17, 'main', 'da42f57e98dc4486f109a2eb2fc3209ba6e8ba26acec15604eb8eee9d7c009f7', '[\"*\"]', NULL, NULL, '2024-01-09 23:01:28', '2024-01-09 23:01:28'),
(237, 'App\\Models\\PPAUser', 5, 'main', 'e5aa4baea7ba82ae297beadff014742a1e0544228e96f6942341ae9963c43a95', '[\"*\"]', '2024-01-10 00:22:59', NULL, '2024-01-09 23:41:34', '2024-01-10 00:22:59'),
(244, 'App\\Models\\PPAUser', 18, 'main', '6282f8c8ebb4d12003b2939991c6b1608824201be78e975e7dc8d0059e2b72ad', '[\"*\"]', NULL, NULL, '2024-01-18 16:47:02', '2024-01-18 16:47:02'),
(250, 'App\\Models\\PPAUser', 4, 'main', 'cc360b822863a7e0d92db8903d73c8fe3d65d296170ba26be19cacbf41d0baf7', '[\"*\"]', '2024-01-19 00:30:22', NULL, '2024-01-18 21:53:56', '2024-01-19 00:30:22'),
(262, 'App\\Models\\PPAUser', 19, 'main', '8d392d3cc82cf3d7875171aca1f993d7ec08505481d80917d9977257ce383ce6', '[\"*\"]', NULL, NULL, '2024-01-21 21:23:29', '2024-01-21 21:23:29'),
(263, 'App\\Models\\PPAUser', 20, 'main', '7174bec052586d57b91c1457e63f983d9364f00e3905e0d20ebd1597ec8ff085', '[\"*\"]', NULL, NULL, '2024-01-21 21:26:40', '2024-01-21 21:26:40'),
(264, 'App\\Models\\PPAUser', 21, 'main', '8e5f621bf9c55f03e2158090118bbf2fef118db8624b3e458ab785cecfecf1b1', '[\"*\"]', NULL, NULL, '2024-01-21 21:29:32', '2024-01-21 21:29:32'),
(265, 'App\\Models\\PPAUser', 22, 'main', 'ca3c0ee629a08cb65e6c534f4423b2f53696880863326d09119c63b367ba86b7', '[\"*\"]', NULL, NULL, '2024-01-21 21:32:15', '2024-01-21 21:32:15'),
(303, 'App\\Models\\PPAUser', 5, 'main', '3b7fcf93fab81e6bfca372199b5a5c69b91817db9101a5abd266e2282a0bb521', '[\"*\"]', '2024-01-24 01:04:02', NULL, '2024-01-23 00:45:00', '2024-01-24 01:04:02'),
(323, 'App\\Models\\PPAUser', 3, 'main', '5c8a1f76e3800f5f6f6f94ec51241b57ffbac857a3dc9f7302d27c6580e67b60', '[\"*\"]', '2024-01-25 00:42:09', NULL, '2024-01-25 00:26:42', '2024-01-25 00:42:09'),
(325, 'App\\Models\\PPAUser', 3, 'main', '0d6a33b932ce480f281dae69d5d3f5aa43ccd167744a8f1f2b6e3ff9eeb81b40', '[\"*\"]', '2024-01-25 16:37:08', NULL, '2024-01-25 00:51:56', '2024-01-25 16:37:08'),
(346, 'App\\Models\\PPAUser', 11, 'main', '432988ae5be14372891a57dd847402c86662c58c5ec926c3f05fc463c64d0f1a', '[\"*\"]', '2024-01-25 22:55:12', NULL, '2024-01-25 20:40:30', '2024-01-25 22:55:12'),
(371, 'App\\Models\\PPAUser', 3, 'main', 'af860f8161109c1522fa5b3679c7718d6ee010e62054b2794c0c862bdf1dd491', '[\"*\"]', NULL, NULL, '2024-01-25 23:14:29', '2024-01-25 23:14:29'),
(375, 'App\\Models\\PPAUser', 11, 'main', '799bbdc413ce05e0957e27ca723d274aa1e463b103d3480c0701aaab5dbbe505', '[\"*\"]', '2024-01-26 00:58:59', NULL, '2024-01-25 23:55:45', '2024-01-26 00:58:59'),
(389, 'App\\Models\\PPAUser', 11, 'main', 'b4a650339ce01bf3a43e25e1c891f2dbf5ee261a94de4995499cc67a0dcfbd1d', '[\"*\"]', '2024-01-28 17:25:20', NULL, '2024-01-28 17:25:04', '2024-01-28 17:25:20'),
(396, 'App\\Models\\PPAUser', 11, 'main', 'd92145115419215cf2fc42fabf25ba80106d79ad40f7fe7d1944ea9355a8036a', '[\"*\"]', '2024-01-29 01:10:40', NULL, '2024-01-28 17:57:01', '2024-01-29 01:10:40'),
(477, 'App\\Models\\PPAUser', 1, 'main', '55ba11c6290a0901fcd0d4f839f0194288adc101a678e1a248acbebcee954a29', '[\"*\"]', '2024-02-06 09:13:47', NULL, '2024-02-06 03:12:35', '2024-02-06 09:13:47'),
(492, 'App\\Models\\PPAUser', 1, 'main', 'df6bc26c152af460384eaa20d238bc114854762403507ff17637e1b99af11a9a', '[\"*\"]', NULL, NULL, '2024-02-08 01:27:05', '2024-02-08 01:27:05'),
(493, 'App\\Models\\PPAUser', 1, 'main', 'dcc828227fa1554cb5399b9d39c8d93552786c5e244667b7b24f2722354c13da', '[\"*\"]', NULL, NULL, '2024-02-08 02:27:52', '2024-02-08 02:27:52'),
(496, 'App\\Models\\PPAUser', 1, 'main', '77a5b051ef67f710cff006f8ee3f51981147846fb406950117cad7226557a2c1', '[\"*\"]', NULL, NULL, '2024-02-08 02:40:19', '2024-02-08 02:40:19'),
(524, 'App\\Models\\PPAUser', 1, 'main', 'a750842f14679db1eb0aaa926d0e9f61ba7b3f8e0c29b5c6aef37fa6e1765aac', '[\"*\"]', '2024-02-10 03:34:17', NULL, '2024-02-10 03:20:15', '2024-02-10 03:34:17'),
(560, 'App\\Models\\PPAUser', 2, 'main', '156d8de31059b58ac2edd6a206b167186cde92ac12618fbbf94f6d857d55f850', '[\"*\"]', '2024-02-12 08:40:21', NULL, '2024-02-12 04:37:18', '2024-02-12 08:40:21'),
(568, 'App\\Models\\PPAUser', 4, 'main', '2676a4cd3e9ec60c38eb0f549daebe0250a08d1fcdbb29156fa7133eca12673f', '[\"*\"]', '2024-02-13 01:34:04', NULL, '2024-02-13 01:28:38', '2024-02-13 01:34:04'),
(632, 'App\\Models\\PPAUser', 23, 'main', 'e113176476ca840a868236665134bd28aefa13f90c4372994afc75f094c70756', '[\"*\"]', NULL, NULL, '2024-02-16 01:51:12', '2024-02-16 01:51:12'),
(705, 'App\\Models\\PPAUser', 24, 'main', '1e0077691b04d98efd64f8da711c828a45613b692ebfe6ff5922cb1ba649b959', '[\"*\"]', NULL, NULL, '2024-02-21 03:04:09', '2024-02-21 03:04:09'),
(713, 'App\\Models\\PPAUser', 5, 'main', '5846dbea5f67a192ebcf19e0d9c8b29f8e75ff400699bf444419dbe544e299ee', '[\"*\"]', '2024-02-21 07:51:04', NULL, '2024-02-21 06:38:19', '2024-02-21 07:51:04'),
(718, 'App\\Models\\PPAUser', 4, 'main', 'd22f178427ed7a0cbcd9b9ca4eb8dd0ed7f29c8bab6cb8c77e53e203a4774015', '[\"*\"]', '2024-02-21 09:23:58', NULL, '2024-02-21 09:23:16', '2024-02-21 09:23:58'),
(721, 'App\\Models\\PPAUser', 4, 'main', '2019eb1c095d40214c9b44c8da4b9d2b6e28e193ed758acffdc7467274da0ce8', '[\"*\"]', '2024-02-22 06:21:27', NULL, '2024-02-22 03:24:12', '2024-02-22 06:21:27'),
(724, 'App\\Models\\PPAUser', 2, 'main', '8185655a080608912736250b363b920c6fd517052cd2f044e36515096c310a0b', '[\"*\"]', NULL, NULL, '2024-02-22 07:01:34', '2024-02-22 07:01:34'),
(725, 'App\\Models\\PPAUser', 2, 'main', '929e7229b86c5142d9307f44b8f4797499a81ca658eda43db9f50e78ee924be0', '[\"*\"]', '2024-02-22 07:12:12', NULL, '2024-02-22 07:11:35', '2024-02-22 07:12:12'),
(726, 'App\\Models\\PPAUser', 2, 'main', '05f2e7e7e13ddf611f1afcced82c25667808d16c32daf612a898e31bb278259a', '[\"*\"]', NULL, NULL, '2024-02-22 07:19:20', '2024-02-22 07:19:20'),
(729, 'App\\Models\\PPAUser', 3, 'main', '182c885dae3aaa53ebe2c2c3b5318a884669d4452e4103bce6feef44d206f3e2', '[\"*\"]', NULL, NULL, '2024-02-22 09:13:03', '2024-02-22 09:13:03'),
(882, 'App\\Models\\PPAUser', 4, 'main', '4eff62037368dcf11f176cc3b653767036f380564d984c8ec4054dee361d82e5', '[\"*\"]', '2024-03-01 07:57:27', NULL, '2024-03-01 07:57:15', '2024-03-01 07:57:27'),
(883, 'App\\Models\\PPAUser', 1, 'main', 'ea3cfa4e3ecc6bd5b13d12021bfd80b71f3e3c2f6d551f34a745453011bb6343', '[\"*\"]', '2024-03-04 06:59:24', NULL, '2024-03-04 02:28:50', '2024-03-04 06:59:24');

-- --------------------------------------------------------

--
-- Table structure for table `p_p_a_users`
--

CREATE TABLE `p_p_a_users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fname` varchar(255) NOT NULL,
  `mname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `division` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `code_clearance` int(11) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `p_p_a_users`
--

INSERT INTO `p_p_a_users` (`id`, `fname`, `mname`, `lname`, `gender`, `username`, `division`, `position`, `code_clearance`, `password`, `image`, `created_at`, `updated_at`) VALUES
(1, 'Zack-Mio', 'A', 'Sermon', 'Male', 'zackmio2023', 'Administrative Division', 'Computer Programmer', 10, '$2a$12$h8gww6TMmY9p888YskjVDedmZJPL5LblK5uKrZ5dtv2MDWnHw8SSu', 'Zack-Mio_Sermon_2023.png', NULL, '2023-11-07 17:58:39'),
(2, 'Daisy', 'P', 'Tangcalagan', 'Female', 'daisy2023', 'Administrative Division', 'Division Manager A', 1, '$2y$10$wT9NYD3Yfq6a6V9joLl7y.pzl7T4ZguIjy7k0XrVFYTHEBrNmdxKa', 'Daisy_Tangcalagan_2023.png', '2023-11-07 19:32:06', '2023-11-07 19:32:06'),
(3, 'Joyriena Lynn', 'M', 'Seco', 'Female', 'joyseco2023', 'Administrative Division', 'Administrative Officer IV', 4, '$2y$10$cFzW/07FsmTSlW9sCyyBEeQDVJ7Rsv0KTrHyPxKOFUZf6grI65tbK', 'Joyriena_Lynn_Seco_2023.png', '2023-11-07 19:33:24', '2023-11-07 19:33:24'),
(4, 'Sue Christine', 'A', 'Sade', 'Female', 'suesade2023', 'Administrative Division', 'General Services Officer A', 3, '$2y$10$NT.1Pe64Gc0dqNu3H2EJcOIhUdixea7PQoxtGNTJb/nM8s7Yv0Cm.', 'Sue_Christine_Sade_2023.png', '2023-11-07 19:34:16', '2023-11-07 19:34:16'),
(5, 'Jeffrey', 'N', 'Silao', 'Male', 'jeffgwapo2023', 'Administrative Division', 'Cash Clerk lll', 10, '$2y$10$uB78ySUwVxIhc3pa8od3/Oj8Iuh.214SSTXXcaPYjxpBmGICxk/R6', 'Jeffrey_Silao_2023.png', '2023-11-07 19:36:15', '2023-11-07 19:36:15'),
(6, 'Daryl', 'T', 'Sumanoy', 'Male', 'daryl2023', 'Administrative Division', 'Driver-Mechanic B', 6, '$2y$10$lIh7Dn2rl9qdqdcNH7bt0.j8j.SSsqHr7SPuF3iHh4raXS/j9YcY.', 'Daryl_Sumanoy_2023.png', '2023-11-16 21:42:36', '2023-11-16 21:43:57'),
(7, 'Medardo', 'I', 'Sosobrado, Jr', 'Male', 'jong2023', 'Office of the Port Manager', 'Division Manager A/Acting Port Manager', 2, '$2y$10$rPAFp5M8kZDqqIJRo5B5Zu7J.kLIWObRMnxLUhFXfr8vps83C9lAG', 'Medardo_Sosobrado, Jr_2023.png', '2023-11-21 01:05:37', '2023-11-21 01:05:37'),
(8, 'Joel', 'A', 'Magno', 'Male', 'jomags2023', 'Administrative Division', 'Plant Mechanic/Electrician B', 6, '$2y$10$WJ4w4llUHnQ00kCLIoZQZOELeBHfA.yKZ4qxyxHPWIUa/ytCinzi.', 'Joel_Magno_2023.png', '2023-12-19 23:15:01', '2023-12-19 23:15:01'),
(9, 'Arnold', 'A', 'Turla', 'Male', 'turla2023', 'Administrative Division', 'Driver Mechanic B', 6, '$2y$10$ffoD1eTl.SLHEOeDujAq4uDLAv8nJmOmU5CdK6HWPNzqglyjhgljK', 'Arnold_Turla_2023.png', '2023-12-19 23:18:14', '2023-12-19 23:18:14'),
(10, 'Rey', 'T', 'Sumanoy', 'Male', 'reysumanoy@2023', 'Administrative Division', 'Driver Mechanic B', 6, '$2y$10$sdouah/qb9UsjPOyfHWjHuty0M0fbEAUPQn.JQ49nwH9bNXOldMbi', 'Rey_Sumanoy_2023.png', '2023-12-19 23:22:31', '2023-12-19 23:22:31'),
(11, 'Jan Dexter', 'T', 'Loang', 'Male', 'Janix2023', 'Administrative Division', 'Driver Mechanic B', 6, '$2y$10$o1EQw7p4r7SNlM1t0RLuFO1kr0DXAb3GxxuyJBiZE9tNNNkqbh1bK', 'Jan_Dexter_Loang_2023.png', '2023-12-19 23:24:33', '2023-12-19 23:24:33'),
(12, 'Noel', 'G', 'Rosero', 'Male', 'noel2023', 'Administrative Division', 'Senior Building Electrician B', 6, '$2y$10$dP6OIxpLBF06PUajSLxQpuMt9TqI92Km5poblJf2XSDMwJP1/0O/.', 'Noel_Rosero_2023.png', '2023-12-19 23:28:58', '2023-12-19 23:28:58'),
(13, 'Ricardo', 'S', 'Villanueva', 'Male', 'ricardo2023', 'Office of the Port Manager', 'Driver Mechanic B ', 6, '$2y$10$K6XRGOP6zXTKCrpBy8sSzu8JCAFBK9LnaV7iTmcB0kZMCbGtW7bWG', 'Ricardo_Villanueva_2023.png', '2023-12-19 23:33:15', '2023-12-19 23:33:15'),
(14, 'Omar', 'A', 'Sabdani', 'Male', 'omar2023', 'Terminal Management Office - Tubod', 'Division Manager C', 4, '$2y$10$toKoCWDzLwKNtmTkcqvATeksjzRnD7ASVUfdbGqZ/HGji/U2OVl7G', 'Omar_Sabdani_2023.png', '2023-12-19 23:35:43', '2024-01-09 22:56:43'),
(15, 'Clint Bryan', 'B', 'Balmores', 'Male', 'balmores2023', 'Terminal Management Office - Tubod', 'Collection Representative A', 5, '$2y$10$0x50g9d/KGeIj8P1fun0yORfNwsTj.w6D3ZapjBrE1v1BEJ4gajDS', 'Clint_Bryan_Balmores_2023.png', '2023-12-19 23:43:01', '2023-12-19 23:43:01'),
(16, 'Aldrin', 'B', 'Denopol', 'Male', 'aldrin2023', 'Office of the Port Manager', 'Electronics Communication System Operator A', 5, '$2y$10$YqFDRkBpVBcQi/ujURbnJ.fEt.YB/sLK6j5n8sxPxLB0l5uPtLEmK', 'Aldrin_Denopol_2023.png', '2023-12-26 17:24:46', '2024-01-23 18:57:47'),
(17, 'Cheryl', 'C', 'Saluta', 'Female', 'cherylsaluta2023', 'Finance Division', 'Division Manager A', 4, '$2y$10$Jn/61mT6JBdRhz..MpgmWu5Y7wfbYrxVZu490tsL3TraQ.RLVXVDq', 'Cheryl_Saluta_2024.png', '2024-01-09 23:01:27', '2024-01-09 23:01:27'),
(18, 'Tedegardo', 'N', 'Garces', 'Male', 'garces2024', 'Port Police Division', 'Harbor Master', 4, '$2y$10$iwMAqh/W.H6fY9tlO750He/7Z53i7pVCkw1IXTIYa.CkkRhgXA7ay', 'Tedegardo_Garces_2024.png', '2024-01-18 16:47:02', '2024-01-18 16:47:02'),
(19, 'Joel', 'B', 'Escala', 'Male', 'joelESD2023', 'Engineering Service Division', 'Division Manager A', 4, '$2y$10$e5YmB7ectShhaAZ.Puw5culu0i1uOV/4HYzvGOSIe19beuOIJOl8K', 'Joel_Escala_2024.png', '2024-01-21 21:23:29', '2024-01-21 21:23:29'),
(20, 'Tito', 'F', 'Pontillo, Jr', 'Male', 'tito2024', 'Port Police Division', 'Civil Security Officer A (Senior Port Police Inspector)/Acting Division Manager A (PPD)', 4, '$2y$10$S0Bt41LJi5ntgxHT/O6OB.st0o5IRGpiovT9PLBWZbm/xLbojy1XS', 'Tito_Pontillo, Jr_2024.png', '2024-01-21 21:26:40', '2024-01-21 21:26:40'),
(21, 'Evelyn', 'F', 'Espinosa', 'Female', 'evelyn2024', 'Office of the Port Manager', 'Executive Assistant A', 4, '$2y$10$/BKuiJ2k3aHx1nEYJxFq0.LNXPkpUrLeC9tw9gbOdl5Z0ihZFrFh6', 'Evelyn_Espinosa_2024.png', '2024-01-21 21:29:32', '2024-01-21 21:29:32'),
(22, 'Jose Randy', 'I', 'Pabelino', 'Male', 'randy@2024', 'Port Service Division', 'Terminal Supervisor A/Acting Division Manager A', 4, '$2y$10$25vzrXzj5CA9UafXbbInFO0ZviJXBhjCkOGkYfQn4njXPgtt3V082', 'Jose_Randy_Pabelino_2024.png', '2024-01-21 21:32:15', '2024-01-21 21:32:15'),
(23, 'John', 'A', 'Doe', 'Male', 'johnDoe', 'Administrative Division', 'Test User', 5, '$2y$10$zKuiQE1zYFru1Bajj5Qjr.VSvZ8BY0RX9mp4yP31Mzv1Sd.oCma4a', 'John_Doe_2024.png', '2024-02-16 01:51:12', '2024-02-16 01:51:12'),
(24, 'Lawrence', 'M', 'Bersaldo', 'Male', 'lao2024', 'Port Police Division', 'Civil Security Officer C', 6, '$2y$10$3LcUY74PjVpJy1HLFANaLOm6hX9qPXBWRXuanoiVrTZDsFlFlW9g2', 'Lawrence_Bersaldo_2024.png', '2024-02-21 03:04:09', '2024-02-21 03:04:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `division` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_slip`
--

CREATE TABLE `vehicle_slip` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `date_of_request` date NOT NULL,
  `purpose` varchar(500) NOT NULL,
  `passengers` varchar(1000) NOT NULL,
  `place_visited` varchar(255) NOT NULL,
  `date_arrival` date NOT NULL,
  `time_arrival` time NOT NULL,
  `vehicle_type` varchar(255) NOT NULL,
  `driver` varchar(255) NOT NULL,
  `admin_approval` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vehicle_slip`
--

INSERT INTO `vehicle_slip` (`id`, `user_id`, `date_of_request`, `purpose`, `passengers`, `place_visited`, `date_arrival`, `time_arrival`, `vehicle_type`, `driver`, `admin_approval`, `created_at`, `updated_at`) VALUES
(1, 1, '2024-03-01', 'Test Request', 'Juanito Santos\nAndres Reyes\nRamon Cruz\nMaria Gonzales\nGabriela Dela Cruz\nSofia Ramos', 'Test Place', '2024-03-01', '15:00:00', 'Isuzu Van = SFT 545', 'Jan Dexter T. Loang', 1, '2024-03-01 05:32:11', '2024-03-01 07:42:47'),
(2, 2, '2024-03-01', 'Test Request', 'Maria Gonzales\nGabriela Dela Cruz\nSofia Ramos', 'Test Place', '2024-03-04', '12:00:00', 'Isuzu Van = SFT 545', 'Rey T. Sumanoy', 1, '2024-03-01 07:45:31', '2024-03-01 07:49:21'),
(3, 4, '2024-03-01', 'Test Request', 'Juanito Santos\nAndres Reyes\nRamon Cruz\nMaria Gonzales\nGabriela Dela Cruz', 'Test Place', '2024-03-12', '14:00:00', 'Toyota Hi-Lux = SFM 708', 'Arnold A. Turla', 1, '2024-03-01 07:50:06', '2024-03-01 07:57:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assign_personnels`
--
ALTER TABLE `assign_personnels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assign_personnels_user_id_foreign` (`user_id`);

--
-- Indexes for table `equipment_form`
--
ALTER TABLE `equipment_form`
  ADD PRIMARY KEY (`id`),
  ADD KEY `equipment_form_user_id_foreign` (`user_id`);

--
-- Indexes for table `facility`
--
ALTER TABLE `facility`
  ADD PRIMARY KEY (`id`),
  ADD KEY `facility_user_id_foreign` (`user_id`);

--
-- Indexes for table `inspection_form_admin`
--
ALTER TABLE `inspection_form_admin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inspection_form_admin_inspection__form_id_foreign` (`inspection__form_id`);

--
-- Indexes for table `inspection__forms`
--
ALTER TABLE `inspection__forms`
  ADD PRIMARY KEY (`id`),
  ADD KEY `inspection__forms_user_id_foreign` (`user_id`);

--
-- Indexes for table `inspector__forms`
--
ALTER TABLE `inspector__forms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `p_p_a_users`
--
ALTER TABLE `p_p_a_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `vehicle_slip`
--
ALTER TABLE `vehicle_slip`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicle_slip_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assign_personnels`
--
ALTER TABLE `assign_personnels`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `equipment_form`
--
ALTER TABLE `equipment_form`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `facility`
--
ALTER TABLE `facility`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `inspection_form_admin`
--
ALTER TABLE `inspection_form_admin`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `inspection__forms`
--
ALTER TABLE `inspection__forms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `inspector__forms`
--
ALTER TABLE `inspector__forms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=884;

--
-- AUTO_INCREMENT for table `p_p_a_users`
--
ALTER TABLE `p_p_a_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicle_slip`
--
ALTER TABLE `vehicle_slip`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assign_personnels`
--
ALTER TABLE `assign_personnels`
  ADD CONSTRAINT `assign_personnels_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `p_p_a_users` (`id`);

--
-- Constraints for table `equipment_form`
--
ALTER TABLE `equipment_form`
  ADD CONSTRAINT `equipment_form_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `p_p_a_users` (`id`);

--
-- Constraints for table `facility`
--
ALTER TABLE `facility`
  ADD CONSTRAINT `facility_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `p_p_a_users` (`id`);

--
-- Constraints for table `inspection_form_admin`
--
ALTER TABLE `inspection_form_admin`
  ADD CONSTRAINT `inspection_form_admin_inspection__form_id_foreign` FOREIGN KEY (`inspection__form_id`) REFERENCES `inspection__forms` (`id`);

--
-- Constraints for table `inspection__forms`
--
ALTER TABLE `inspection__forms`
  ADD CONSTRAINT `inspection__forms_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `p_p_a_users` (`id`);

--
-- Constraints for table `vehicle_slip`
--
ALTER TABLE `vehicle_slip`
  ADD CONSTRAINT `vehicle_slip_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `p_p_a_users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
