-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 14, 2024 at 03:08 AM
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
(1, 13, 'IT Service', '2024-03-20 07:18:25', '2024-03-20 07:18:25'),
(2, 14, 'Driver/Mechanic', '2024-03-20 07:20:17', '2024-03-20 07:20:17'),
(3, 15, 'Driver/Mechanic', '2024-03-20 07:20:49', '2024-03-20 07:20:49'),
(4, 16, 'Driver/Mechanic', '2024-03-20 07:23:16', '2024-03-20 07:23:16'),
(10, 18, 'IT Service', '2024-04-30 07:00:24', '2024-04-30 07:00:24'),
(11, 1, 'IT Service', '2024-05-06 06:38:59', '2024-05-06 06:38:59'),
(12, 17, 'IT Service', '2024-05-06 06:39:26', '2024-05-06 06:39:26'),
(13, 124, 'IT Service', '2024-05-06 06:39:58', '2024-05-06 06:39:58'),
(14, 92, 'IT Service', '2024-05-06 06:40:35', '2024-05-06 06:40:35'),
(15, 87, 'Janitorial Service', '2024-05-06 06:41:13', '2024-05-06 06:41:13'),
(16, 67, 'IT Service', '2024-05-06 06:41:37', '2024-05-06 06:41:37'),
(17, 99, 'Electronics', '2024-05-06 06:42:11', '2024-05-06 06:42:11'),
(18, 94, 'Janitorial Service', '2024-05-06 06:42:33', '2024-05-06 06:42:33'),
(19, 101, 'Electronics', '2024-05-06 06:42:58', '2024-05-06 06:42:58'),
(20, 88, 'Janitorial Service', '2024-05-06 06:43:33', '2024-05-06 06:43:33'),
(21, 86, 'Electrical Works', '2024-05-06 06:44:42', '2024-05-06 06:44:42'),
(22, 95, 'Janitorial Service', '2024-05-06 06:45:14', '2024-05-06 06:45:14'),
(23, 93, 'Electrical Works', '2024-05-06 06:45:55', '2024-05-06 06:45:55'),
(24, 42, 'Electrical Works', '2024-05-06 06:46:11', '2024-05-06 06:46:11'),
(25, 100, 'Janitorial Service', '2024-05-06 06:46:29', '2024-05-06 06:46:29'),
(26, 90, 'Watering Services', '2024-05-06 06:46:36', '2024-05-06 06:46:36'),
(27, 122, 'Engeneering Services', '2024-05-06 06:47:12', '2024-05-06 06:47:12'),
(28, 131, 'Engeneering Services', '2024-05-06 06:47:41', '2024-05-06 06:47:41'),
(29, 120, 'Engeneering Services', '2024-05-06 06:48:15', '2024-05-06 06:48:15'),
(30, 102, 'Janitorial Service', '2024-05-06 06:48:44', '2024-05-06 06:48:44'),
(31, 118, 'Engeneering Services', '2024-05-06 06:48:50', '2024-05-06 06:48:50'),
(32, 91, 'Janitorial Service', '2024-05-06 06:49:19', '2024-05-06 06:49:19'),
(33, 114, 'Janitorial Service', '2024-05-06 06:49:59', '2024-05-06 06:49:59'),
(34, 103, 'Janitorial Service', '2024-05-06 06:50:42', '2024-05-06 06:50:42'),
(35, 128, 'Janitorial Service', '2024-05-06 06:50:44', '2024-05-06 06:50:44'),
(36, 127, 'Janitorial Service', '2024-05-06 06:51:13', '2024-05-06 06:51:13'),
(37, 104, 'Janitorial Service', '2024-05-06 06:51:26', '2024-05-06 06:51:26'),
(38, 106, 'Janitorial Service', '2024-05-06 06:51:40', '2024-05-06 06:51:40'),
(39, 69, 'Janitorial Service', '2024-05-06 06:51:59', '2024-05-06 06:51:59'),
(40, 109, 'Janitorial Service', '2024-05-06 06:52:18', '2024-05-06 06:52:18'),
(41, 89, 'Janitorial Service', '2024-05-06 06:52:41', '2024-05-06 06:52:41'),
(42, 110, 'Janitorial Service', '2024-05-06 06:52:41', '2024-05-06 06:52:41'),
(43, 117, 'Janitorial Service', '2024-05-06 06:53:19', '2024-05-06 06:53:19'),
(44, 70, 'Janitorial Service', '2024-05-06 06:53:19', '2024-05-06 06:53:19'),
(45, 112, 'Janitorial Service', '2024-05-06 06:53:57', '2024-05-06 06:53:57'),
(46, 43, 'Driver/Mechanic', '2024-05-06 06:54:12', '2024-05-06 06:54:12'),
(48, 44, 'Driver/Mechanic', '2024-05-06 06:55:37', '2024-05-06 06:55:37'),
(50, 72, 'Driver/Mechanic', '2024-05-06 06:56:43', '2024-05-06 06:56:43'),
(51, 64, 'Driver/Mechanic', '2024-05-06 06:57:26', '2024-05-06 06:57:26');

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
  `property_description` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `complain` varchar(255) NOT NULL,
  `supervisor_name` smallint(6) NOT NULL,
  `supervisor_approval` tinyint(1) NOT NULL DEFAULT 0,
  `admin_approval` tinyint(1) NOT NULL DEFAULT 0,
  `inspector_status` int(1) NOT NULL,
  `remarks` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `remarks` varchar(1000) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(26, '2024_02_14_154226_create_notification_table', 10),
(27, '2024_04_01_131434_create_logs_table', 11),
(28, '2024_05_07_143310_create_notifications_table', 12);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` int(11) NOT NULL,
  `type_of_request` varchar(255) NOT NULL,
  `message` varchar(400) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `sender_id`, `type_of_request`, `message`, `status`, `created_at`, `updated_at`) VALUES
(1, 5, 'Pre-Repair/Post Repair Inspect Form', 'There is a request for sir Zack-Mio Sermon, and it requires your approval', 1, '2024-05-07 07:21:33', '2024-05-07 07:21:33'),
(2, 5, 'Pre-Repair/Post Repair Inspect Form', 'There is a request for sir John Ian Obach, and it requires your approval', 1, '2024-05-07 07:29:09', '2024-05-07 07:29:09');

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
(909, 'App\\Models\\PPAUser', 2, 'main', '8b3cb6831aa0a0faef353f9ab47cddd8295c291ec7eb1a8a8265fcfe617a4763', '[\"*\"]', '2024-03-12 09:04:58', NULL, '2024-03-12 05:21:33', '2024-03-12 09:04:58'),
(910, 'App\\Models\\PPAUser', 2, 'main', '5bb90d0318fe03dfa2e4499733af7038d629849aa0f343d9fd14d75aa0a9dd61', '[\"*\"]', '2024-03-13 03:14:59', NULL, '2024-03-13 00:44:24', '2024-03-13 03:14:59'),
(916, 'App\\Models\\PPAUser', 4, 'main', 'fb793466be269a88c790e6e1bfcca2b681ff8b45434bc17365ecd455048dabd7', '[\"*\"]', '2024-03-14 01:03:57', NULL, '2024-03-13 08:56:18', '2024-03-14 01:03:57'),
(918, 'App\\Models\\PPAUser', 2, 'main', '067a00d12420fe0792bc8b42caec0593af894da8a078f6995c9ee6cee1e61896', '[\"*\"]', NULL, NULL, '2024-03-20 02:29:31', '2024-03-20 02:29:31'),
(919, 'App\\Models\\PPAUser', 3, 'main', '9c7e5dc6440faf34adb84acb8a7a522fe14d00e4e0e70a38938fc6c606d82106', '[\"*\"]', NULL, NULL, '2024-03-20 03:03:10', '2024-03-20 03:03:10'),
(920, 'App\\Models\\PPAUser', 4, 'main', 'bc95d4c73b4ba1777ce03deedd9d0b8c056ddf47a8f4e4b6c988c1fb78e6262e', '[\"*\"]', NULL, NULL, '2024-03-20 03:26:14', '2024-03-20 03:26:14'),
(921, 'App\\Models\\PPAUser', 5, 'main', '54070d951a0631fd3498aa710062adafab4d3125e1936f0744b12013371c4201', '[\"*\"]', NULL, NULL, '2024-03-20 06:30:10', '2024-03-20 06:30:10'),
(922, 'App\\Models\\PPAUser', 6, 'main', '76683b075a982f3e8f9193e0672216999119ef4539f238f0b9c6411e119ce5f0', '[\"*\"]', NULL, NULL, '2024-03-20 06:31:49', '2024-03-20 06:31:49'),
(923, 'App\\Models\\PPAUser', 7, 'main', '0d1edae52e5fed8b737468581f7205f2d7b28768dc60f34743ca8ef8b9244b6c', '[\"*\"]', NULL, NULL, '2024-03-20 06:34:18', '2024-03-20 06:34:18'),
(924, 'App\\Models\\PPAUser', 8, 'main', '8778d9e992725200adf6005d13b23b0b009c172f7926557aa4bc1228029d5467', '[\"*\"]', NULL, NULL, '2024-03-20 06:40:45', '2024-03-20 06:40:45'),
(925, 'App\\Models\\PPAUser', 9, 'main', 'da5ef0a06c205a7c8159cb917943d69caf929d293dca8c7e7763c3c3cfcd766f', '[\"*\"]', NULL, NULL, '2024-03-20 06:52:36', '2024-03-20 06:52:36'),
(926, 'App\\Models\\PPAUser', 10, 'main', '3c3556b1ddabcbee8e6342a3fcfe61ebda88b3bb001b895e7492c7239f905065', '[\"*\"]', NULL, NULL, '2024-03-20 06:54:50', '2024-03-20 06:54:50'),
(927, 'App\\Models\\PPAUser', 11, 'main', '588af04c8c71b8b473542d195a86ce2379b493677b44e86c9dd5a16da5fe8e64', '[\"*\"]', NULL, NULL, '2024-03-20 07:02:46', '2024-03-20 07:02:46'),
(928, 'App\\Models\\PPAUser', 12, 'main', 'b0a8587913cf9bd1075f7a632b4d0274abb6d54b1e2b486eb54a8877df1f8dd3', '[\"*\"]', NULL, NULL, '2024-03-20 07:04:48', '2024-03-20 07:04:48'),
(929, 'App\\Models\\PPAUser', 13, 'main', 'b3fadff878d23380da6ce296fe206d548d8db94966a5fdb0e410c9f1057182bb', '[\"*\"]', NULL, NULL, '2024-03-20 07:09:39', '2024-03-20 07:09:39'),
(930, 'App\\Models\\PPAUser', 14, 'main', '71965a8a1533a2a0b78e7ced4b19ee22a5b2a8421010721cae558f88a59bfbf4', '[\"*\"]', NULL, NULL, '2024-03-20 07:13:09', '2024-03-20 07:13:09'),
(931, 'App\\Models\\PPAUser', 15, 'main', 'c38894114c2b69ad1e50ad6fcf69ce43e72e56a5558f88b75bf22d751291aa9c', '[\"*\"]', NULL, NULL, '2024-03-20 07:14:04', '2024-03-20 07:14:04'),
(932, 'App\\Models\\PPAUser', 16, 'main', 'c882a6e76448b12eba1e3731bdeeb344624665835293e5d24975a5e6bca90acf', '[\"*\"]', NULL, NULL, '2024-03-20 07:16:46', '2024-03-20 07:16:46'),
(934, 'App\\Models\\PPAUser', 5, 'main', '5c638adec7fd251ea1475036da5e0870282ad59ee59c14035525e991bdd23cf6', '[\"*\"]', '2024-03-21 05:55:26', NULL, '2024-03-21 05:50:22', '2024-03-21 05:55:26'),
(949, 'App\\Models\\PPAUser', 6, 'main', '6bb50ef7ffe5ac490712e22e046e5a1b4c013475feb031c8df095ae8abb1b8ce', '[\"*\"]', '2024-03-26 03:15:50', NULL, '2024-03-26 03:13:50', '2024-03-26 03:15:50'),
(952, 'App\\Models\\PPAUser', 1, 'main', '79d0afc73741a0a0bb745b39ce53c16e14c09ab3850f0eef667b10cd13443341', '[\"*\"]', '2024-03-27 02:27:43', NULL, '2024-03-27 02:01:11', '2024-03-27 02:27:43'),
(960, 'App\\Models\\PPAUser', 1, 'main', '784b54305fe417d9ef3a59dc68a584a89a676de53dbfe765f37eb481e14d17cb', '[\"*\"]', '2024-03-27 02:25:52', NULL, '2024-03-27 02:25:12', '2024-03-27 02:25:52'),
(970, 'App\\Models\\PPAUser', 1, 'main', '92791847654f1f22b525683fdc138a5b87badd5c8ce20816e793f386054ffb44', '[\"*\"]', '2024-03-27 04:00:43', NULL, '2024-03-27 04:00:31', '2024-03-27 04:00:43'),
(973, 'App\\Models\\PPAUser', 17, 'main', '241291dfb6d919445c717ccbb9fef95c1b478a94e0fe4aa4d732394736738133', '[\"*\"]', NULL, NULL, '2024-04-01 05:52:35', '2024-04-01 05:52:35'),
(974, 'App\\Models\\PPAUser', 18, 'main', '09f7e48027a09b530253ad4d184f2375c39339ede689a7bf452e4daa7cff1131', '[\"*\"]', NULL, NULL, '2024-04-01 05:57:32', '2024-04-01 05:57:32'),
(1006, 'App\\Models\\PPAUser', 1, 'main', 'a0c7aade72517215c2bb7755f80e4152a2e7d56b37cc45cabb043d89f5755d21', '[\"*\"]', '2024-04-04 05:05:26', NULL, '2024-04-03 03:29:08', '2024-04-04 05:05:26'),
(1007, 'App\\Models\\PPAUser', 4, 'main', 'b7ba7a075a68e60f16eda49befc1f5b1a7295a13e0dae92a6e587a2cb0960ab4', '[\"*\"]', '2024-04-04 05:26:11', NULL, '2024-04-03 05:28:00', '2024-04-04 05:26:11'),
(1008, 'App\\Models\\PPAUser', 6, 'main', '3bf355a1d86c15961a9ae494b8be3b74d1606429764fd75fa3036e804c9445e5', '[\"*\"]', '2024-04-04 01:16:04', NULL, '2024-04-04 00:34:47', '2024-04-04 01:16:04'),
(1009, 'App\\Models\\PPAUser', 5, 'main', 'a939ec5486a6e8f2d8606390c634df9c7018a0b29f6bb278b2704284e5e6965b', '[\"*\"]', '2024-04-04 01:06:00', NULL, '2024-04-04 00:50:31', '2024-04-04 01:06:00'),
(1010, 'App\\Models\\PPAUser', 4, 'main', '164abbe8c2bd9c4cec1af66383f99a468213bed332c7bbc6ee1c74ccc18e900e', '[\"*\"]', '2024-04-04 01:10:27', NULL, '2024-04-04 00:52:38', '2024-04-04 01:10:27'),
(1011, 'App\\Models\\PPAUser', 13, 'main', '9809aed050d3363cb6600fd4e44256fd1215333045a8337bcce334af42ba96c3', '[\"*\"]', '2024-04-04 00:55:09', NULL, '2024-04-04 00:53:53', '2024-04-04 00:55:09'),
(1014, 'App\\Models\\PPAUser', 1, 'main', '28f17040b232e31ae96c67333a97fcfd5ea0dc6079c33d823a2188a75131f619', '[\"*\"]', '2024-04-04 05:26:43', NULL, '2024-04-04 02:58:37', '2024-04-04 05:26:43'),
(1015, 'App\\Models\\PPAUser', 1, 'main', '6e9426f838e0eb398fe3f0e58b34afbad36708efbdaded0a0918c80bc078bb1e', '[\"*\"]', NULL, NULL, '2024-04-05 00:59:01', '2024-04-05 00:59:01'),
(1016, 'App\\Models\\PPAUser', 1, 'main', '9bd4cfc971a594dc8041fd6d064f646fd8e002a02a5d9e0e1d60a60be49cc7f9', '[\"*\"]', NULL, NULL, '2024-04-05 01:22:26', '2024-04-05 01:22:26'),
(1017, 'App\\Models\\PPAUser', 1, 'main', '86694e92dfa18cf4e3c6cded58b450c209b31ec1a5477057c8fd8fd9794192bd', '[\"*\"]', NULL, NULL, '2024-04-05 01:22:39', '2024-04-05 01:22:39'),
(1022, 'App\\Models\\PPAUser', 6, 'main', 'ab326446a52cef80f589485e80849ab00f71f82f4c0a78ee0ab6e4e907138ba6', '[\"*\"]', '2024-04-14 05:34:27', NULL, '2024-04-11 03:31:50', '2024-04-14 05:34:27'),
(1073, 'App\\Models\\PPAUser', 1, 'main', 'a3865a10ed65d011af8ca43806c942658a1b7f5d54a96093de152e8ed24ef49e', '[\"*\"]', '2024-04-19 01:55:29', NULL, '2024-04-18 07:26:24', '2024-04-19 01:55:29'),
(1080, 'App\\Models\\PPAUser', 4, 'main', 'dec05905a73666b06be393045537f899b7c374fbd668eba50cef46931545f5e7', '[\"*\"]', '2024-04-19 02:00:07', NULL, '2024-04-19 01:56:09', '2024-04-19 02:00:07'),
(1171, 'App\\Models\\PPAUser', 4, 'main', 'f64d0f09e95605b234f510e0aff1729b52f67461e16a8c1d6655d9cccb2ab7b6', '[\"*\"]', '2024-04-29 05:24:47', NULL, '2024-04-29 02:48:44', '2024-04-29 05:24:47'),
(1187, 'App\\Models\\PPAUser', 6, 'main', 'ec74d6f7bc4765875366d733fa2c2a5dee3f3cc3f2d8fc15484bb21d1aa95886', '[\"*\"]', '2024-04-30 06:43:52', NULL, '2024-04-30 02:17:36', '2024-04-30 06:43:52'),
(1195, 'App\\Models\\PPAUser', 4, 'main', 'aa938910479262111479654cdaf70e871d7d48a6489b88edb17e3784eb648f45', '[\"*\"]', '2024-05-03 09:01:27', NULL, '2024-05-02 02:53:47', '2024-05-03 09:01:27'),
(1198, 'App\\Models\\PPAUser', 1, 'main', 'e4f8eb9fd8b763e278b4550f7e5a628d135a491c5a61a131948e7b2d99a55439', '[\"*\"]', '2024-05-14 01:01:33', NULL, '2024-05-02 05:58:29', '2024-05-14 01:01:33'),
(1199, 'App\\Models\\PPAUser', 1, 'main', '324424630ca437e7a3ab7c159bb27a82821860a2d187c46ba16bf0c3c9e9ae7f', '[\"*\"]', NULL, NULL, '2024-05-06 01:24:59', '2024-05-06 01:24:59'),
(1200, 'App\\Models\\PPAUser', 1, 'main', '3bd98e5afada69887f4a9301f80c019b2d9d715d79352cbe5cac7add2a9f3fa2', '[\"*\"]', NULL, NULL, '2024-05-06 01:35:45', '2024-05-06 01:35:45'),
(1201, 'App\\Models\\PPAUser', 1, 'main', 'bc560586c8ed970486b805ba82013e2f8964db0993da4a05c5d096c8b8b70e70', '[\"*\"]', '2024-05-06 01:36:58', NULL, '2024-05-06 01:36:53', '2024-05-06 01:36:58'),
(1202, 'App\\Models\\PPAUser', 1, 'main', '67203368fe2acdf54c99d51e463a10e0ccda282987a460a65f39a16396e8dd13', '[\"*\"]', '2024-05-06 08:46:31', NULL, '2024-05-06 01:39:34', '2024-05-06 08:46:31'),
(1205, 'App\\Models\\PPAUser', 19, 'main', '64c29b51e0bb1c56c7f77ecd84458380e8e7d2e62867b63a2e8ed6dde91c65ca', '[\"*\"]', NULL, NULL, '2024-05-06 02:07:02', '2024-05-06 02:07:02'),
(1206, 'App\\Models\\PPAUser', 1, 'main', '7d634e86951cd2e4dd8b91ecc36ba02e2fb6d68b3b28a8daf3529f1379a6c623', '[\"*\"]', '2024-05-06 05:29:37', NULL, '2024-05-06 02:10:23', '2024-05-06 05:29:37'),
(1207, 'App\\Models\\PPAUser', 20, 'main', 'a36cbdf4a56dea77b43e196c6ff81005dced9254a56f83f0213b409953c1a7a1', '[\"*\"]', NULL, NULL, '2024-05-06 02:10:38', '2024-05-06 02:10:38'),
(1208, 'App\\Models\\PPAUser', 21, 'main', '7cc569219a447017fa64d3d511159bcb86ac08e68100262a833c0dd6e344f777', '[\"*\"]', NULL, NULL, '2024-05-06 02:21:15', '2024-05-06 02:21:15'),
(1209, 'App\\Models\\PPAUser', 22, 'main', '4fcea74e8eb241f981475d38f7c01fe48c915c6a5aa001b87a03d3d923a7f8b0', '[\"*\"]', NULL, NULL, '2024-05-06 02:22:03', '2024-05-06 02:22:03'),
(1210, 'App\\Models\\PPAUser', 23, 'main', '4e39f5c48517eb3c209bcb85613549db8bf298dc60854637fb9a4344d272d0da', '[\"*\"]', NULL, NULL, '2024-05-06 02:23:02', '2024-05-06 02:23:02'),
(1211, 'App\\Models\\PPAUser', 24, 'main', '608f05a596f2f66a0e7404f38bb75ae6160fc6f76792d2decbcfd11049db707c', '[\"*\"]', NULL, NULL, '2024-05-06 02:24:27', '2024-05-06 02:24:27'),
(1212, 'App\\Models\\PPAUser', 25, 'main', '6a8c3088d43b280b9527f022a6cbcbab6a625410463d40f8d4aafbb267b54da7', '[\"*\"]', NULL, NULL, '2024-05-06 02:27:12', '2024-05-06 02:27:12'),
(1213, 'App\\Models\\PPAUser', 26, 'main', '6eb73d6e77b3458b3213ec5ab0d87cc20ebcf12222558e0acd01c3877aed030c', '[\"*\"]', NULL, NULL, '2024-05-06 02:30:03', '2024-05-06 02:30:03'),
(1214, 'App\\Models\\PPAUser', 27, 'main', '1448ee35abc46d3fb9e56919c899ecd07da605fcfb74285bd9d5efa5dce42090', '[\"*\"]', NULL, NULL, '2024-05-06 02:30:11', '2024-05-06 02:30:11'),
(1215, 'App\\Models\\PPAUser', 28, 'main', 'd8c39dda2b3d0fa9fe66381f48530584dbe46b023fa57a03e3dcb6bb73dc3b83', '[\"*\"]', NULL, NULL, '2024-05-06 02:32:50', '2024-05-06 02:32:50'),
(1216, 'App\\Models\\PPAUser', 29, 'main', '9fe3937daddd344e0dce59718dfba7a4071c95df651ce08b5fafca5f6254b707', '[\"*\"]', NULL, NULL, '2024-05-06 02:37:01', '2024-05-06 02:37:01'),
(1217, 'App\\Models\\PPAUser', 30, 'main', '976b26ea1acba7d60ece6f31198f7d180f3ccf12738a918971a4388153fdfbe1', '[\"*\"]', NULL, NULL, '2024-05-06 02:39:56', '2024-05-06 02:39:56'),
(1218, 'App\\Models\\PPAUser', 31, 'main', '43a0e5ee12c22e829adf97b175052cd2e5ab0526f4f3638eea4e11cd4c9b7d3b', '[\"*\"]', NULL, NULL, '2024-05-06 02:41:40', '2024-05-06 02:41:40'),
(1219, 'App\\Models\\PPAUser', 32, 'main', '8d7d61553b03ce1b1ee3e34c07bf652c6a81ccda482e476aa6dd8a2da5ec5af8', '[\"*\"]', NULL, NULL, '2024-05-06 02:42:17', '2024-05-06 02:42:17'),
(1220, 'App\\Models\\PPAUser', 33, 'main', '3651afee19fe58d6e102be18ccdd4ea61436c0ade3161069cd2aae3fdf090bfd', '[\"*\"]', NULL, NULL, '2024-05-06 02:44:46', '2024-05-06 02:44:46'),
(1221, 'App\\Models\\PPAUser', 34, 'main', 'fa98ec579e641db4bd3ec610c187708c68104afa86ce46603ba3cab394a81446', '[\"*\"]', NULL, NULL, '2024-05-06 02:52:14', '2024-05-06 02:52:14'),
(1222, 'App\\Models\\PPAUser', 35, 'main', 'db4e696200e0a0b447886c749198c4053735d13d4541b62ccb5a3faa8c7f7096', '[\"*\"]', NULL, NULL, '2024-05-06 02:54:33', '2024-05-06 02:54:33'),
(1223, 'App\\Models\\PPAUser', 36, 'main', '3c924c2c8a9aaed709ba9b80b63a3717ac751042db058090a97868ce8283ff92', '[\"*\"]', NULL, NULL, '2024-05-06 02:55:50', '2024-05-06 02:55:50'),
(1224, 'App\\Models\\PPAUser', 37, 'main', '2afe9044de827e08526c631afd09765202c5971e1daf13f08fe994e3a021fd35', '[\"*\"]', NULL, NULL, '2024-05-06 02:57:09', '2024-05-06 02:57:09'),
(1225, 'App\\Models\\PPAUser', 38, 'main', '824130d0016737dd6923e7d2d3f432f244d89f469baabad9be8b4f5b083752cf', '[\"*\"]', NULL, NULL, '2024-05-06 02:59:09', '2024-05-06 02:59:09'),
(1226, 'App\\Models\\PPAUser', 39, 'main', 'e3903c6dfae7c6b350cc98ef866508154c89f3f138455eecfb19f4369b4609cf', '[\"*\"]', NULL, NULL, '2024-05-06 03:00:45', '2024-05-06 03:00:45'),
(1227, 'App\\Models\\PPAUser', 40, 'main', 'c9efe2aa8a9ff802ad405707a495560097eaa790e933a4fc3d53c4c93a48d64f', '[\"*\"]', NULL, NULL, '2024-05-06 03:06:04', '2024-05-06 03:06:04'),
(1228, 'App\\Models\\PPAUser', 41, 'main', '832d520b63ccd6226c993343762d29a5249787e7dfd1b7e00ca9380457d029f8', '[\"*\"]', NULL, NULL, '2024-05-06 03:08:32', '2024-05-06 03:08:32'),
(1229, 'App\\Models\\PPAUser', 42, 'main', '995339b1f2e145dbed1fc2ff5fd9cab2234bc671e0eaa506ff20a004b7028f0c', '[\"*\"]', NULL, NULL, '2024-05-06 03:09:14', '2024-05-06 03:09:14'),
(1230, 'App\\Models\\PPAUser', 43, 'main', 'd05ae511a94f71715a05c79ee535d041023eefee008fcc264a8592f465e64664', '[\"*\"]', NULL, NULL, '2024-05-06 03:09:51', '2024-05-06 03:09:51'),
(1231, 'App\\Models\\PPAUser', 44, 'main', 'e836329b3a6e209a0f230df1f283217a12ceb9d614deba5cd4af4bb0f83d65b4', '[\"*\"]', NULL, NULL, '2024-05-06 03:12:37', '2024-05-06 03:12:37'),
(1232, 'App\\Models\\PPAUser', 45, 'main', '007122605d917b6b68de7df42d75bf56f8cc1ec573db1ce6ff70ebefb6af437b', '[\"*\"]', NULL, NULL, '2024-05-06 03:12:42', '2024-05-06 03:12:42'),
(1233, 'App\\Models\\PPAUser', 46, 'main', 'c7906fab4e72d66db65a8311557730486a4f8e49af7f14c3a0ffff8fe07eaeee', '[\"*\"]', NULL, NULL, '2024-05-06 03:15:51', '2024-05-06 03:15:51'),
(1234, 'App\\Models\\PPAUser', 47, 'main', 'c9f8170570cd65dba0832f494fba8dd753cac932cb911aece21cfa5680cc8119', '[\"*\"]', NULL, NULL, '2024-05-06 03:19:24', '2024-05-06 03:19:24'),
(1235, 'App\\Models\\PPAUser', 48, 'main', '28ed2c85e61898326638a327964d4caee43f0ed63a0cf5b3243d1c95da73357f', '[\"*\"]', NULL, NULL, '2024-05-06 03:19:57', '2024-05-06 03:19:57'),
(1236, 'App\\Models\\PPAUser', 49, 'main', 'a351d9638d6ed74ad60a3f044993aa88c9a9fb308f92124ed2d0fd43ff37bf42', '[\"*\"]', NULL, NULL, '2024-05-06 03:20:50', '2024-05-06 03:20:50'),
(1237, 'App\\Models\\PPAUser', 50, 'main', '72df8820c19c5223d1ab976944c6d67b1f0765dafc464b056407cb5034fd76fb', '[\"*\"]', NULL, NULL, '2024-05-06 03:22:54', '2024-05-06 03:22:54'),
(1238, 'App\\Models\\PPAUser', 51, 'main', '7f12e0ba53d3d4154f50b092c57268727fae865eac406dd26b7803ea7244766e', '[\"*\"]', NULL, NULL, '2024-05-06 03:23:25', '2024-05-06 03:23:25'),
(1239, 'App\\Models\\PPAUser', 52, 'main', '2cfea23174335f736430cff677df8decac2a86e93d56445168eda62ed38cad26', '[\"*\"]', NULL, NULL, '2024-05-06 03:25:10', '2024-05-06 03:25:10'),
(1240, 'App\\Models\\PPAUser', 53, 'main', '25cf0d94c16669e97afdba33b598e11d8769e2328cf71f4a21dd6a3bf5d25238', '[\"*\"]', NULL, NULL, '2024-05-06 03:25:45', '2024-05-06 03:25:45'),
(1241, 'App\\Models\\PPAUser', 54, 'main', '141a7f1b2576b492135d2b3c4f4e056c2294688e0914eb9d8ae795758e6abde9', '[\"*\"]', NULL, NULL, '2024-05-06 03:27:45', '2024-05-06 03:27:45'),
(1242, 'App\\Models\\PPAUser', 55, 'main', '846739f6f1d0770fda796be4b1cd7cbd25b5643e45ec5dff3bb078cddb052529', '[\"*\"]', NULL, NULL, '2024-05-06 03:29:29', '2024-05-06 03:29:29'),
(1243, 'App\\Models\\PPAUser', 56, 'main', '28969b8c8c4a3ca34d602a48b95e749116187af2c1bd5e095b543e4051708e78', '[\"*\"]', NULL, NULL, '2024-05-06 03:30:23', '2024-05-06 03:30:23'),
(1244, 'App\\Models\\PPAUser', 57, 'main', 'bfa206b0cbc309b9fb7d2ebbec996ad7d8f2c3162199374e932bd2cf42ec0cd7', '[\"*\"]', NULL, NULL, '2024-05-06 03:32:20', '2024-05-06 03:32:20'),
(1245, 'App\\Models\\PPAUser', 58, 'main', '71d2dedcaaf38bb5de6898046981ee91a46690b3279e63e9e2e1352fe2aef3f5', '[\"*\"]', NULL, NULL, '2024-05-06 03:34:57', '2024-05-06 03:34:57'),
(1246, 'App\\Models\\PPAUser', 59, 'main', 'fb8194e0b2767589eeac2e9e870511c3593b795f7e97a240c39813ea024db7dc', '[\"*\"]', NULL, NULL, '2024-05-06 03:36:51', '2024-05-06 03:36:51'),
(1247, 'App\\Models\\PPAUser', 60, 'main', 'd4501e585fe82cc3c4ffe9c0d5cb33baaf70e163267cb7c2d487d85c125ee6f4', '[\"*\"]', NULL, NULL, '2024-05-06 03:37:13', '2024-05-06 03:37:13'),
(1248, 'App\\Models\\PPAUser', 61, 'main', '9fc72e3106dd69bd2fc9a527abd3d9d589d8710e7604ac706a86f6f423336427', '[\"*\"]', NULL, NULL, '2024-05-06 03:38:22', '2024-05-06 03:38:22'),
(1249, 'App\\Models\\PPAUser', 62, 'main', '8e843031e4c05b72442fe0cea87085b2dcca389d0b458e10b2b088db2c828b9b', '[\"*\"]', NULL, NULL, '2024-05-06 03:39:54', '2024-05-06 03:39:54'),
(1250, 'App\\Models\\PPAUser', 63, 'main', '2c6e0f164b3c7649fe19151d2c4249e8271d749f7471a8cd6d2b13e1f5c9a43e', '[\"*\"]', NULL, NULL, '2024-05-06 03:40:02', '2024-05-06 03:40:02'),
(1251, 'App\\Models\\PPAUser', 64, 'main', '847ba45fa1a38f60fde4612136620059521bae1f6db36fde2214bfff8fa9d62d', '[\"*\"]', NULL, NULL, '2024-05-06 03:42:10', '2024-05-06 03:42:10'),
(1252, 'App\\Models\\PPAUser', 65, 'main', 'bf98ee4c3c379d568c586088ce08b3e64973ae2154870b8788ff747148a49e27', '[\"*\"]', NULL, NULL, '2024-05-06 03:43:58', '2024-05-06 03:43:58'),
(1253, 'App\\Models\\PPAUser', 66, 'main', 'a228eeddeca7e6b98dee1f3a7ec4391ce479eb865ba491e36fa6965abd3c53bc', '[\"*\"]', NULL, NULL, '2024-05-06 03:45:11', '2024-05-06 03:45:11'),
(1254, 'App\\Models\\PPAUser', 67, 'main', '0dc4b559fe3a2a4822ba97a90bdc616e1246cac53b70a2994ac3f793c3e3aab9', '[\"*\"]', NULL, NULL, '2024-05-06 03:46:52', '2024-05-06 03:46:52'),
(1255, 'App\\Models\\PPAUser', 68, 'main', '47cfced66e00f0eeb6b39d5b7b9088124feef8f768d3cd7c7d49fe2fb602c241', '[\"*\"]', NULL, NULL, '2024-05-06 03:47:46', '2024-05-06 03:47:46'),
(1256, 'App\\Models\\PPAUser', 69, 'main', 'a0d8cd17143ed09631d243e78d18208f221e31491cbfd9f81f047a2456c75080', '[\"*\"]', NULL, NULL, '2024-05-06 03:48:39', '2024-05-06 03:48:39'),
(1257, 'App\\Models\\PPAUser', 70, 'main', 'f48ef49cd92dc953d48e9f1cf54c13fd78a11b9c98e4922d35a51ad271207eca', '[\"*\"]', NULL, NULL, '2024-05-06 03:49:52', '2024-05-06 03:49:52'),
(1258, 'App\\Models\\PPAUser', 71, 'main', 'f834b4fb5d53bf775e6a4ce9672394006253c92e9428a9bb95764bfdd7e7fa54', '[\"*\"]', NULL, NULL, '2024-05-06 03:50:30', '2024-05-06 03:50:30'),
(1259, 'App\\Models\\PPAUser', 72, 'main', '3153cc0811a0ad9373da71f3b7e37cc24ddb61140580a9d61a9fc3f73ccca27d', '[\"*\"]', NULL, NULL, '2024-05-06 03:52:42', '2024-05-06 03:52:42'),
(1260, 'App\\Models\\PPAUser', 73, 'main', '269b0a7efbcf81b65d86eff6958a1bd37c3581a095d6c2b8e20426fdff823d8a', '[\"*\"]', NULL, NULL, '2024-05-06 03:58:01', '2024-05-06 03:58:01'),
(1261, 'App\\Models\\PPAUser', 74, 'main', 'd2254a880b27667116b0ab73c009eb767419ff318995d4aa63f2f92fc2c50b30', '[\"*\"]', NULL, NULL, '2024-05-06 04:02:00', '2024-05-06 04:02:00'),
(1262, 'App\\Models\\PPAUser', 75, 'main', 'dc7bbbcadcb6c327d618ab3300aa3a545f22561f0cb33d8b6dd8d71a1ff92f0f', '[\"*\"]', NULL, NULL, '2024-05-06 04:04:10', '2024-05-06 04:04:10'),
(1263, 'App\\Models\\PPAUser', 76, 'main', '3352867f5317191c812a28a421046aaa6786a1a5e5d07f7a62157a00cf073a5c', '[\"*\"]', NULL, NULL, '2024-05-06 04:06:00', '2024-05-06 04:06:00'),
(1264, 'App\\Models\\PPAUser', 77, 'main', 'b8286f61a3c46f230d0640320469448d72e69262c3a831c447b98869e4e5f799', '[\"*\"]', NULL, NULL, '2024-05-06 04:06:55', '2024-05-06 04:06:55'),
(1265, 'App\\Models\\PPAUser', 78, 'main', 'f3925c3e93bec66a485501b2f7843218a182ff5484d5a0695204cc0f4b586beb', '[\"*\"]', NULL, NULL, '2024-05-06 04:08:29', '2024-05-06 04:08:29'),
(1266, 'App\\Models\\PPAUser', 79, 'main', 'b126b830d513dadf4338e21862dd3494a394f0a839d7f05fdd4613fdfc5b54a1', '[\"*\"]', NULL, NULL, '2024-05-06 04:09:59', '2024-05-06 04:09:59'),
(1267, 'App\\Models\\PPAUser', 80, 'main', '274c167e3407e9911a0c7f2354e239609df07c7013a810196a362791036bdaf1', '[\"*\"]', NULL, NULL, '2024-05-06 04:11:04', '2024-05-06 04:11:04'),
(1268, 'App\\Models\\PPAUser', 81, 'main', 'e34990880d6683ababa1149462fdf101be0e0384a91579f9b336b2b78ea73e11', '[\"*\"]', NULL, NULL, '2024-05-06 04:13:27', '2024-05-06 04:13:27'),
(1269, 'App\\Models\\PPAUser', 82, 'main', '4e06262b3f20e185a7b6325c73107bfa19d32c305176ca612c02dbb85e6ccc7c', '[\"*\"]', NULL, NULL, '2024-05-06 04:14:11', '2024-05-06 04:14:11'),
(1270, 'App\\Models\\PPAUser', 83, 'main', '8db0d2cf80e29617ce839656e5f3b9a17f626e9acb81f9f76410ef4b905783c2', '[\"*\"]', NULL, NULL, '2024-05-06 04:16:53', '2024-05-06 04:16:53'),
(1271, 'App\\Models\\PPAUser', 84, 'main', '0c30d560b37a15978bf3f2638c956cdd9cefd45d74cd1eccbb54a8906bc63086', '[\"*\"]', NULL, NULL, '2024-05-06 04:17:00', '2024-05-06 04:17:00'),
(1272, 'App\\Models\\PPAUser', 85, 'main', 'a11b6d6760fab48619bd2d3a8784ead020235a671bda1bc9ec8306f8e65a946e', '[\"*\"]', NULL, NULL, '2024-05-06 04:19:14', '2024-05-06 04:19:14'),
(1273, 'App\\Models\\PPAUser', 86, 'main', '9363231c344f9e335744f26527de2af2e957118d53c9d86f551fd5b0024027ff', '[\"*\"]', NULL, NULL, '2024-05-06 04:19:48', '2024-05-06 04:19:48'),
(1274, 'App\\Models\\PPAUser', 87, 'main', '8f220c16b56eda6769bbb715a7ee11cea3510398629badc50079b3a4a1a647a2', '[\"*\"]', NULL, NULL, '2024-05-06 04:21:16', '2024-05-06 04:21:16'),
(1275, 'App\\Models\\PPAUser', 88, 'main', '855a7fe81d58c82d298483b8f76407a2184f367764921b286d27e40e21a07b1a', '[\"*\"]', NULL, NULL, '2024-05-06 04:22:32', '2024-05-06 04:22:32'),
(1276, 'App\\Models\\PPAUser', 89, 'main', 'd7cb91a13011d1a1647dab83a95a89707d2d805ddaf1f84657aae94444998f55', '[\"*\"]', NULL, NULL, '2024-05-06 04:24:14', '2024-05-06 04:24:14'),
(1277, 'App\\Models\\PPAUser', 90, 'main', 'eba3ccb9aea686056d18312471c23a679800c2a8c7cbf8283b67fd4fc5740644', '[\"*\"]', NULL, NULL, '2024-05-06 04:25:28', '2024-05-06 04:25:28'),
(1278, 'App\\Models\\PPAUser', 91, 'main', 'de86d7d837401fac2452e877edf6e8a2a404335f17dcc7ec5faf2354fc787320', '[\"*\"]', NULL, NULL, '2024-05-06 04:27:19', '2024-05-06 04:27:19'),
(1279, 'App\\Models\\PPAUser', 92, 'main', '24a68c53d830fd0ddb0ccd840c4edb211720637a14f8b082c57ea46c3ba5ef0a', '[\"*\"]', NULL, NULL, '2024-05-06 04:27:53', '2024-05-06 04:27:53'),
(1280, 'App\\Models\\PPAUser', 93, 'main', '5dde63fe03eaa94f0ebf5ebac964432873f693b21e25e3687269c37d979e3929', '[\"*\"]', NULL, NULL, '2024-05-06 04:28:44', '2024-05-06 04:28:44'),
(1281, 'App\\Models\\PPAUser', 94, 'main', '52b5035073337e71bb1137b4e130d7d5e2fd2f108e08acf46db30a13d78bec77', '[\"*\"]', NULL, NULL, '2024-05-06 04:29:58', '2024-05-06 04:29:58'),
(1282, 'App\\Models\\PPAUser', 95, 'main', '3e86527b8dda1221e14381c2575e6121ffa663a01bf21b986982b8dbcaad007a', '[\"*\"]', NULL, NULL, '2024-05-06 04:30:18', '2024-05-06 04:30:18'),
(1283, 'App\\Models\\PPAUser', 96, 'main', 'b28abc071b2283e31ff34c89c1c3552a1fedd56c642ffc2c11b2b986d719b656', '[\"*\"]', NULL, NULL, '2024-05-06 04:31:21', '2024-05-06 04:31:21'),
(1284, 'App\\Models\\PPAUser', 97, 'main', '67f6d0fd52265545bd1982f8caf47059acb6969adab9e558d2661a7492c97a86', '[\"*\"]', NULL, NULL, '2024-05-06 04:32:53', '2024-05-06 04:32:53'),
(1285, 'App\\Models\\PPAUser', 98, 'main', '5eec95c3b51f7f44a8be4ea3f317979184883dc83b664b8ca1e44aa8c07a7734', '[\"*\"]', NULL, NULL, '2024-05-06 04:35:03', '2024-05-06 04:35:03'),
(1286, 'App\\Models\\PPAUser', 99, 'main', '8816183194a6eb146a73443782a9a4d8567d34aa03a65743d3d28e918d2fa9a9', '[\"*\"]', NULL, NULL, '2024-05-06 04:35:06', '2024-05-06 04:35:06'),
(1287, 'App\\Models\\PPAUser', 100, 'main', 'ee32e3e2a4b44aac62f2a4fbd6cfcc6ed802606333a12a6d0c4533e56a6296c8', '[\"*\"]', NULL, NULL, '2024-05-06 04:36:42', '2024-05-06 04:36:42'),
(1288, 'App\\Models\\PPAUser', 101, 'main', 'b8d8bd9e1b6b1aa4b7cc62987c16612cbe09c46b76ae52734fb80d46d638c06c', '[\"*\"]', NULL, NULL, '2024-05-06 04:37:28', '2024-05-06 04:37:28'),
(1289, 'App\\Models\\PPAUser', 102, 'main', 'cd03060f2a90680a291c69caf2f9e8d043e1b5858ef999c2cba5644f6e66bb65', '[\"*\"]', NULL, NULL, '2024-05-06 04:39:57', '2024-05-06 04:39:57'),
(1290, 'App\\Models\\PPAUser', 103, 'main', 'b940499478e2b6929524fa269bdd8f75f879c312b2de61307f34f5e7b4633c47', '[\"*\"]', NULL, NULL, '2024-05-06 04:41:19', '2024-05-06 04:41:19'),
(1291, 'App\\Models\\PPAUser', 104, 'main', '94631bd2cbf0552ff5bab084d3232fab8fe146254e39e46cf7441f393883265f', '[\"*\"]', NULL, NULL, '2024-05-06 04:43:10', '2024-05-06 04:43:10'),
(1292, 'App\\Models\\PPAUser', 105, 'main', 'ff74710036b2dbbeee3272bed8d1550b3273ae287f8cdf36464191d15c6c2163', '[\"*\"]', NULL, NULL, '2024-05-06 04:45:10', '2024-05-06 04:45:10'),
(1293, 'App\\Models\\PPAUser', 106, 'main', '3fc0b3991c0dbeee856888893df73d62c5e984bc4b4ad1a31168344b90da06ef', '[\"*\"]', NULL, NULL, '2024-05-06 04:46:06', '2024-05-06 04:46:06'),
(1294, 'App\\Models\\PPAUser', 107, 'main', '28978571ed35fd78797fe90a52f9358b649d722d269bf8b93235857df0f8492f', '[\"*\"]', NULL, NULL, '2024-05-06 04:48:40', '2024-05-06 04:48:40'),
(1295, 'App\\Models\\PPAUser', 108, 'main', '3a90a0f615ad84736d36dc0d0fae37d6d64281095c8abd42f78086985d99ca3a', '[\"*\"]', NULL, NULL, '2024-05-06 04:49:24', '2024-05-06 04:49:24'),
(1296, 'App\\Models\\PPAUser', 109, 'main', 'be5ff14a8122d2bfe24d0db46d4d95193228b80cc123fc2453cf771e8a425245', '[\"*\"]', NULL, NULL, '2024-05-06 04:52:42', '2024-05-06 04:52:42'),
(1297, 'App\\Models\\PPAUser', 110, 'main', '6c566302980d283c8778ffa614cbccae26ce7bde74186c151f689394ffa35546', '[\"*\"]', NULL, NULL, '2024-05-06 04:54:36', '2024-05-06 04:54:36'),
(1298, 'App\\Models\\PPAUser', 111, 'main', 'd37ce0bb6d7330a943ceb790f4a5fc455af9e548dba6e3c6e0c5f90b957f7909', '[\"*\"]', NULL, NULL, '2024-05-06 04:56:03', '2024-05-06 04:56:03'),
(1299, 'App\\Models\\PPAUser', 112, 'main', 'd812542ba940133d552b8be4badd486de83533b05527d547bf425047ccb82519', '[\"*\"]', NULL, NULL, '2024-05-06 04:58:34', '2024-05-06 04:58:34'),
(1300, 'App\\Models\\PPAUser', 113, 'main', '1d95e0d2bfb4e593144a41fd92504d2248bece2638a5856a2b0d2fc554671942', '[\"*\"]', NULL, NULL, '2024-05-06 04:58:51', '2024-05-06 04:58:51'),
(1301, 'App\\Models\\PPAUser', 114, 'main', '854c1cf78cd1e9f1d97e02c0377120ae7bafd10b73cb6e463e5230edcde46f62', '[\"*\"]', NULL, NULL, '2024-05-06 05:00:50', '2024-05-06 05:00:50'),
(1302, 'App\\Models\\PPAUser', 115, 'main', '90aafda8b3195050b80552e9ccff8860a75767e8c0be8b6a0bb29185706e89f8', '[\"*\"]', NULL, NULL, '2024-05-06 05:00:58', '2024-05-06 05:00:58'),
(1303, 'App\\Models\\PPAUser', 116, 'main', '1d97aedad0b8f1b01f085b36e6b553076bf52d277761d2799294d000fc63820c', '[\"*\"]', NULL, NULL, '2024-05-06 05:02:13', '2024-05-06 05:02:13'),
(1304, 'App\\Models\\PPAUser', 117, 'main', '500143c27253bba48327041509bac882322ed07804edfd4093f9a0f57d6c21f5', '[\"*\"]', NULL, NULL, '2024-05-06 05:03:05', '2024-05-06 05:03:05'),
(1305, 'App\\Models\\PPAUser', 118, 'main', 'cfd995e9be462a54d2f3cca730c2dab2007e397af35a2eca6f0d0df7bfd607f7', '[\"*\"]', NULL, NULL, '2024-05-06 05:04:53', '2024-05-06 05:04:53'),
(1306, 'App\\Models\\PPAUser', 119, 'main', 'accf2f50f61b85cd9881b3a0c2c4a1aa70d248a82081b339ee77ce73339c1fc9', '[\"*\"]', NULL, NULL, '2024-05-06 05:06:22', '2024-05-06 05:06:22'),
(1307, 'App\\Models\\PPAUser', 120, 'main', '6f7be6cfe84debe426a4cd368ff27917f33d29012a25abb59b45b70a505bf394', '[\"*\"]', NULL, NULL, '2024-05-06 05:06:52', '2024-05-06 05:06:52'),
(1308, 'App\\Models\\PPAUser', 121, 'main', 'bfaa68e1af251c49deb2667fb9ff56a3f6ca72f67871d4077b1eddab1db0dda7', '[\"*\"]', NULL, NULL, '2024-05-06 05:08:39', '2024-05-06 05:08:39'),
(1309, 'App\\Models\\PPAUser', 122, 'main', 'e9d374d188eb907c75601ae184b42e3cd4c875ca7b85cc4cdaca5afa46202bfc', '[\"*\"]', NULL, NULL, '2024-05-06 05:09:00', '2024-05-06 05:09:00'),
(1310, 'App\\Models\\PPAUser', 123, 'main', '3d308783423915c8057e2ca16b5713b0bb41f1319f9198cc4cf518087b7de8e7', '[\"*\"]', NULL, NULL, '2024-05-06 05:31:00', '2024-05-06 05:31:00'),
(1311, 'App\\Models\\PPAUser', 124, 'main', '0a643e3c212e8e4f9468d3950de659199930328fd4398041dca8bae8cfab4e2e', '[\"*\"]', NULL, NULL, '2024-05-06 05:32:46', '2024-05-06 05:32:46'),
(1312, 'App\\Models\\PPAUser', 125, 'main', '832f75caf9f4e27810ab6f076b5acfa46913574c0c2a8526ca28336077465f56', '[\"*\"]', NULL, NULL, '2024-05-06 05:34:23', '2024-05-06 05:34:23'),
(1313, 'App\\Models\\PPAUser', 126, 'main', '38c7f091a59491676bd4ad6e756e141215b3c714fab2217bc11867caea57c882', '[\"*\"]', NULL, NULL, '2024-05-06 05:36:14', '2024-05-06 05:36:14'),
(1314, 'App\\Models\\PPAUser', 127, 'main', '3e2c6b5a5f1754b289279286969b3c6b52f576e515a6c7349a11627c3d5a3a89', '[\"*\"]', NULL, NULL, '2024-05-06 05:37:45', '2024-05-06 05:37:45'),
(1315, 'App\\Models\\PPAUser', 128, 'main', '52c3efbd3f5ea26218a281259082b0d6132bf07887d5627649979b746f1e12d0', '[\"*\"]', NULL, NULL, '2024-05-06 05:38:46', '2024-05-06 05:38:46'),
(1316, 'App\\Models\\PPAUser', 129, 'main', 'aefa120294bf27cce44c38cfed468837588ced06d65136b963bb6bcebdec4cd0', '[\"*\"]', NULL, NULL, '2024-05-06 05:56:23', '2024-05-06 05:56:23'),
(1317, 'App\\Models\\PPAUser', 130, 'main', '25008b68ae93d5b55619ff8903242f0826ac28b17836db7fef2eb46e6b57915d', '[\"*\"]', NULL, NULL, '2024-05-06 05:58:56', '2024-05-06 05:58:56'),
(1318, 'App\\Models\\PPAUser', 131, 'main', '161ca3d2c4fa38919aa7eacddfd944c1f54e45321fe847b26e0f81c914abb418', '[\"*\"]', NULL, NULL, '2024-05-06 06:17:48', '2024-05-06 06:17:48'),
(1328, 'App\\Models\\PPAUser', 3, 'main', '44ebf486abfd8216c78be11760872c989dfacae694151060e9d1efb1bc2e7b48', '[\"*\"]', '2024-05-06 08:16:36', NULL, '2024-05-06 07:23:02', '2024-05-06 08:16:36'),
(1367, 'App\\Models\\PPAUser', 32, 'main', '01b0df7947a9a7191d8faf5c6a2dc368a2a1c02f93f7e1d679da1b5d3bc1e8f1', '[\"*\"]', '2024-05-06 08:57:32', NULL, '2024-05-06 08:47:22', '2024-05-06 08:57:32'),
(1370, 'App\\Models\\PPAUser', 1, 'main', '519b9b96da805c955b9a25bd6dd865a4f4dfa2d77f78f63beb946b0b0b3bb9bc', '[\"*\"]', '2024-05-07 05:05:08', NULL, '2024-05-06 23:52:26', '2024-05-07 05:05:08'),
(1378, 'App\\Models\\PPAUser', 5, 'main', '3f82202b20dea5708c89ef4c0681e578262acaa2c9f73fe38a29819977f431c4', '[\"*\"]', '2024-05-07 01:00:44', NULL, '2024-05-07 01:00:27', '2024-05-07 01:00:44'),
(1404, 'App\\Models\\PPAUser', 6, 'main', '77d7b672b3ebd9d3bb9840c14cd08f3866fc61be31c3f1da75e5489bbd5dc877', '[\"*\"]', '2024-05-07 05:05:07', NULL, '2024-05-07 02:08:20', '2024-05-07 05:05:07'),
(1427, 'App\\Models\\PPAUser', 13, 'main', '6326c0f723b1b293b4f22a821105136870a5a13b3e6acfdd5b042c863a74fd99', '[\"*\"]', '2024-05-07 03:15:58', NULL, '2024-05-07 03:14:02', '2024-05-07 03:15:58'),
(1428, 'App\\Models\\PPAUser', 6, 'main', '086ae0768c94415299077747dc00621bc02b457d859ae924d4b01da003430e25', '[\"*\"]', '2024-05-07 03:15:23', NULL, '2024-05-07 03:14:49', '2024-05-07 03:15:23'),
(1437, 'App\\Models\\PPAUser', 5, 'main', '5a370ca90debe70ad8e0a09f49f67b2f19e4846dbe44f90f9d23f97052202a08', '[\"*\"]', '2024-05-09 23:42:17', NULL, '2024-05-08 03:04:08', '2024-05-09 23:42:17'),
(1439, 'App\\Models\\PPAUser', 74, 'main', '9214884461a9883cb52a27bf738ce690dea841fe4738fe52320e1d2dcb035018', '[\"*\"]', '2024-05-09 07:33:53', NULL, '2024-05-08 06:17:33', '2024-05-09 07:33:53');

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
(1, 'Zack-Mio', 'A', 'Sermon', 'Male', 'zackmio2023', 'Administrative Division', 'Information System Analyst ll', 10, '$2a$12$h8gww6TMmY9p888YskjVDedmZJPL5LblK5uKrZ5dtv2MDWnHw8SSu', 'Zack-Mio_Sermon_2023.png', '2023-11-07 17:58:39', '2024-05-06 05:50:49'),
(2, 'Juan', 'A', 'Dela Cruz', 'Male', 'juan2024', 'Administrative Division', 'Flower', 5, '$2y$10$4g8uq8nwjxW56qrxZ1WmguW2Z62s5juvPTAJciUKcWiSvwAmlV5Wq', 'Juan_Dela Cruz_2024.png', '2024-03-20 02:29:31', '2024-04-03 07:57:30'),
(3, 'Medardo', 'I', 'Sosobrado, Jr', 'Male', 'PPA_jong', 'Office of the Port Manager', 'Acting Port Manager', 2, '$2y$10$Cm67OnOUxwmZPnR4h45dK.k06ymv2o06lkRUcWbIi/uztTq3unJxy', 'Medardo_Sosobrado, Jr_2024.png', '2024-03-20 03:03:10', '2024-03-20 03:26:49'),
(4, 'Daisy', 'P', 'Tangcalagan', 'Female', 'PPA_Daisy', 'Administrative Division', 'Division Manager A', 1, '$2y$10$PDqUB7Pat5DSdYT2q5K3pOrHIfC2cpTIvPR/vwQOj8K60FrynDF9S', 'Daisy_Tangcalagan_2024.png', '2024-03-20 03:26:14', '2024-03-20 03:26:14'),
(5, 'Joyriena Lynn', 'M', 'Seco', 'Female', 'PPA_JoySeco', 'Administrative Division', 'Administrative Officer IV', 4, '$2y$10$wvolnDJEXzelaCA/1FXMDu87j/w.jlYUhW/0S0xANkhZBoKjA99Qe', 'Joyriena_Lynn_Seco_2024.png', '2024-03-20 06:30:10', '2024-03-20 06:30:10'),
(6, 'Sue Christine', 'A', 'Sade', 'Female', 'PPA_Sue', 'Administrative Division', 'General Services Officer A', 3, '$2y$10$A63AsRkQFiRrtDKXQmAThe7/7QIhj7ecIubtDZqT/PVxECHSTubSO', 'Sue_Christine_Sade_2024.png', '2024-03-20 06:31:49', '2024-03-20 06:31:49'),
(7, 'Evelyn', 'F', 'Espinosa', 'Female', 'PPA_Evelyn', 'Office of the Port Manager', 'Executive Assistant A', 4, '$2y$10$osVaKIHz0jTfcnjMz6gHcufwr0WaVxhmlNAH/gilw3dpVMgkaow1.', 'Evelyn_Espinosa_2024.png', '2024-03-20 06:34:18', '2024-03-20 06:34:18'),
(8, 'Cheryl', 'C', 'Saluta', 'Female', 'PPA_Che', 'Finance Division', 'Division Manager A', 4, '$2y$10$gkz1RgfaQvaQkx4Iw3yMaO0XMblC8jQlmtECDoFsQ0nxcuPQ6A3nG', 'Cheryl_Saluta_2024.png', '2024-03-20 06:40:45', '2024-03-20 06:40:45'),
(9, 'Jose Randy', 'I', 'Pabelino', 'Male', 'PPA_Randy', 'Port Service Division', 'Terminal Supervisor A', 4, '$2y$10$bToQ3zLH/f9D1pzh3RHbj.TNhpLB1sCDy0s7G/.lIutpDqqYGQpY6', 'Jose_Randy_Pabelino_2024.png', '2024-03-20 06:52:36', '2024-03-20 06:52:36'),
(10, 'Joel', 'B', 'Escala', 'Male', 'PPA_Joel', 'Engineering Service Division', 'Division Manager A', 4, '$2y$10$jIc/8RKvsnRH0Ced3B3RAeU/.5FTByGeaCaUbgyOnevNDgL9i4MZC', 'Joel_Escala_2024.png', '2024-03-20 06:54:50', '2024-03-20 06:54:50'),
(11, 'Tito', 'F', 'Pontillo, Jr', 'Male', 'PPA_Tito', 'Port Police Division', 'Civil Security Officer A', 4, '$2y$10$g7PEY30glDbXpAnTHPEUrO0fZh6T8RPyGDOL.rotytKfI2w2KJMbu', 'Tito_Pontillo, Jr_2024.png', '2024-03-20 07:02:46', '2024-03-20 07:02:46'),
(12, 'Omar', 'A', 'Sabdani', 'Male', 'PPA_Omar', 'Terminal Management Office - Tubod', 'Division Manager C', 4, '$2y$10$sS/sFDg3hL6Tw1V7NhHPFe.Iw7Ch5QsyvWXVc2xY0EXXcd7FMbw6u', 'Omar_Sabdani_2024.png', '2024-03-20 07:04:48', '2024-03-20 07:04:48'),
(13, 'Jeffrey', 'N', 'Silao', 'Male', 'PPA_Jeffrey', 'Administrative Division', 'Computer Maintenance Technologist I', 7, '$2y$10$kmdXStzd5SqIb8a2EqVZa.VRXwm6.0c.8kSSiUI6RMDvdiaDECs8.', 'Jeffrey_Silao_2024.png', '2024-03-20 07:09:39', '2024-03-20 07:44:00'),
(14, 'Rey', 'T', 'Sumanoy', 'Male', 'PPA_Rey', 'Administrative Division', 'Driver Mechanic B', 6, '$2y$10$TPk2xMHuiOITycEuNb2iyejq3jRmsUTnqO6H.CW0nGoGIwZ890ho6', 'Rey_Sumanoy_2024.png', '2024-03-20 07:13:09', '2024-03-20 07:20:17'),
(15, 'Arnold', 'A', 'Turla', 'Male', 'PPA_Turla', 'Administrative Division', 'Driver Mechanic B', 6, '$2y$10$Y16QWQ3qvijYWqVhkQkZ.OWRdftds2A7x/PdGuEkgHbIhrLIX3NqO', 'Arnold_Turla_2024.png', '2024-03-20 07:14:04', '2024-03-20 07:20:49'),
(16, 'Jan Dexter', 'T', 'Loang', 'Male', 'PPA_Jan', 'Administrative Division', 'Driver Mechanic A', 6, '$2y$10$tNJ3UhqGIDmoLeUyQisK7OYCh3wZYoF/a914QZlDHhFtZeMMY0Foa', 'Jan_Dexter_Loang_2024.png', '2024-03-20 07:16:46', '2024-05-06 06:06:52'),
(17, 'Raymart', 'E', 'Ruelan', 'Male', 'PPA_Raymart', 'Administrative Division', 'Clerk Processor A', 6, '$2y$10$tO9Ekj7Fe1Qi0oHaDB4NF.UKpNsfDLSKhdm/dw4gqcN122pMh54dK', 'Raymart_Ruelan_2024.png', '2024-04-01 05:52:35', '2024-05-06 06:39:26'),
(18, 'Cris Ian', 'R', 'Jacinto', 'Male', 'PPA_Ian', 'Administrative Division', 'Management Information System Analyst /IT Team', 6, '$2y$10$jfe8xEhAiTRMW0fPSbm7f.FYl6ARckp5gQwkAd1UP8/TQ8SyA2ms.', 'Cris_Ian_Jacinto_2024.png', '2024-04-01 05:57:32', '2024-04-30 07:00:24'),
(19, 'Marianne', 'S', 'Paglinawan', 'Female', 'PPA_Paglinawan', 'Office of the Port Manager', 'Business Development/Marketing Specialist', 5, '$2y$10$QEW.ml7ebq58J2wZWSX9We527jSLvw5zPqLWaO9LWIwB1w1VX6KZy', 'Marianne_Paglinawan_2024.png', '2024-05-06 02:07:02', '2024-05-06 05:46:06'),
(20, 'Joanne Mae', 'S', 'Janulgue', 'Female', 'PPA_Janulgue', 'Office of the Port Manager', 'Executive Secretary C', 5, '$2y$10$VMYaHV67cazItWyQbslMYu3D4gsCegnEIRHsCLMaIQ7zpRGTCzNLK', 'Joanne_Mae_Janulgue_2024.png', '2024-05-06 02:10:38', '2024-05-06 02:25:00'),
(21, 'Angelyn', 'M', 'Lepiten', 'Female', 'PPA_Lepiten', 'Office of the Port Manager', 'Project Planning & Development Officer A', 5, '$2y$10$I71u1D8fwuRlu8HlUdAZl.F76411nnwAdURyTz49GSvlSwQZfRQB.', 'Angelyn_Lepiten_2024.png', '2024-05-06 02:21:15', '2024-05-06 02:27:15'),
(22, 'Elva', 'A', 'Real', 'Female', 'PPA_Real', 'Office of the Port Manager', 'Business Development/ Marketing Officer A', 5, '$2y$10$WnGtW7qQJNVGtNq9UodJ6eIN.bmZVRWHgfTaUmIoSlPbPY.P0b7Zq', 'Elva_Real_2024.png', '2024-05-06 02:22:03', '2024-05-06 05:47:55'),
(23, 'Jonalyn', 'N', 'Dandasan', 'Female', 'PPA_Dandasan', 'Finance Division', 'Corporate Finance Services Chief', 5, '$2y$10$z8XRUJAatiiIYRnEsfu5uO0A.mHt2MS7OnPYoCHcB44wn8YDzmOwG', 'Jonalyn_Dandasan_2024.png', '2024-05-06 02:23:02', '2024-05-06 02:26:14'),
(24, 'Loradel', 'B', 'Pabillar', 'Female', 'PPA_Pabillar', 'Finance Division', 'Senior Corporate Accountant A', 5, '$2y$10$IGD9dFP8ZSkSpJPGNJhKVu8p.mdZZWLRtBU/Nub7Z0u9LcFE9FFra', 'Loradel_Pabillar_2024.png', '2024-05-06 02:24:27', '2024-05-06 02:59:00'),
(25, 'Juliet', 'B', 'Merioles', 'Female', 'PPA_Merioles', 'Finance Division', 'Senior Cashier', 5, '$2y$10$l9c1h094RMtN7CEo91cPde6QgpHgVBCP9a/tDzk3fqmzLwyqpOuH.', 'Juliet_Merioles_2024.png', '2024-05-06 02:27:12', '2024-05-06 02:54:14'),
(26, 'Edgardo', 'B', 'Dandoy', 'Male', 'PPA_Dandoy', 'Finance Division', 'Cashier B', 5, '$2y$10$IEqeEEN3Py9AwR5rii5DLOs6AgNR29qAXzrgzpKDfKoc7vNFX.7Bi', 'Edgardo_Dandoy_2024.png', '2024-05-06 02:30:03', '2024-05-06 02:44:21'),
(27, 'Christine', 'J', 'Merto', 'Female', 'PPA_Merto', 'Finance Division', 'Cashier A', 5, '$2y$10$AeIIzJzW7iEhqowmpnt3wuX.cUAQvO.4phBYhtZ048u3bpbOM7pUK', 'Christine_Merto_2024.png', '2024-05-06 02:30:11', '2024-05-06 02:54:56'),
(28, 'Christine', 'R', 'Jacinto', 'Female', 'PPA_Jacinto', 'Finance Division', 'Cashier B', 5, '$2y$10$rJjGf1S0M23O/j6O4EF02eZidEf8T3Mt04xjA0mEa2A3pEE7s.5MW', 'Christine_Jacinto_2024.png', '2024-05-06 02:32:50', '2024-05-06 02:52:34'),
(29, 'Gemma', 'P', 'Pontillo', 'Female', 'PPA_Pontillo', 'Finance Division', 'Senior Corporate Accounts Analyst', 5, '$2y$10$UiltqwuXoa61LEF2RbC/ROCGFvpX9zrOJDv/WHDms5tQzMOly3KoW', 'Gemma_Pontillo_2024.png', '2024-05-06 02:37:01', '2024-05-06 05:50:43'),
(30, 'Kate Wendell', 'A', 'Eugenio', 'Female', 'PPA_Eugenio', 'Finance Division', 'Cashier B', 5, '$2y$10$mUcHlylebry5SCURdikICOy/lDcqBi6exytQsHawub9v7JN0zfQIS', 'Kate_Wendell_Eugenio_2024.png', '2024-05-06 02:39:56', '2024-05-06 02:51:47'),
(31, 'Hazel', 'B', 'Nadorra', 'Female', 'PPA_Nadorra', 'Finance Division', 'Cashier B', 5, '$2y$10$d5i9YVLCm4OlS8QhXpEIi.1pZVEJz.ekLmkZ/pbq.JWHPCKsMETHi', 'Hazel_Nadorra_2024.png', '2024-05-06 02:41:40', '2024-05-06 02:56:49'),
(32, 'Janrey Vincent', 'P', 'Durano', 'Male', 'PPA_Durano', 'Finance Division', 'Cashier B', 5, '$2y$10$zrSWxyBWuca/96UXbW0U1uO8Swj8lKCl3h/6f/E07ZByIYeNuTejW', 'Janrey_Vincent_Durano_2024.png', '2024-05-06 02:42:17', '2024-05-06 02:50:29'),
(33, 'Janessa', 'P', 'Balt', 'Female', 'PPA_Balt', 'Finance Division', 'Clearing Officer IV', 5, '$2y$10$YfwZWz/5dFY74BsmFAotQOzWSiwp7q.iPwebCVgCVaUjdUqAfSBBG', 'Janessa_Balt_2024.png', '2024-05-06 02:44:46', '2024-05-06 02:48:51'),
(34, 'Naomie', 'D', 'Zalsos', 'Female', 'PPA_Zalsos', 'Administrative Division', 'Human Resource Management Officer III', 5, '$2y$10$1MSZHVwsgJJlo7g6j18oMeYmhqzgD5CIP/PYRs5H/IFuZFbAYDT/i', 'Naomie_Zalsos_2024.png', '2024-05-06 02:52:14', '2024-05-06 05:58:29'),
(35, 'Sheila Andrea', 'R', 'Bollozos', 'Female', 'PPA_Bollozos', 'Administrative Division', 'Human Resource Management Officer III', 5, '$2y$10$kV6bh9/ijsIrdV5ulT45eeiXoMiXxCNTrn5y5b1ZKR9740xp51FA.', 'Sheila_Andrea_Bollozos_2024.png', '2024-05-06 02:54:33', '2024-05-06 02:55:38'),
(36, 'Diony Lou', 'A', 'Jao', 'Female', 'PPA_Jao', 'Port Service Division', 'Environmental Specialist A', 5, '$2y$10$uk/r/.RvGBhkJJvKrg1nDewQ1BXLO6tVGTrU8Y3fgvGUy1G0S8mby', 'Diony_Lou_Jao_2024.png', '2024-05-06 02:55:50', '2024-05-06 02:58:13'),
(37, 'Elinor Rosemary', 'G', 'Sevilla', 'Female', 'PPA_Sevilla', 'Administrative Division', 'Records Officer A', 5, '$2y$10$0e9OfoPknQentPehI//0vuDa2lLb6Xs7ZUR7mA506Lp.oo3ZGBeTO', 'Elinor_Rosemary_Sevilla_2024.png', '2024-05-06 02:57:09', '2024-05-06 06:00:44'),
(38, 'Carolyn Gracelda', 'N', 'Orquillas', 'Female', 'PPA_Orquillas', 'Administrative Division', 'Human Resource Management Officer II', 5, '$2y$10$Jz1rS6pRPZwx3ZYQ6EVbkuQpcCrho82QNTPOZOplDHSstSNVsBOQ6', 'Carolyn_Gracelda_Orquillas_2024.png', '2024-05-06 02:59:09', '2024-05-06 03:11:42'),
(39, 'Abigail Rose', 'N', 'Suangco', 'Female', 'PPA_AbiSuangco', 'Administrative Division', 'Human Resource Management Officer II', 5, '$2y$10$H7yADOlGVDqAQuROPjdANe8Lr93JlJ961nU79Yera0SjZ/NWqT4lu', 'Abigail_Rose_Suangco_2024.png', '2024-05-06 03:00:45', '2024-05-06 06:02:47'),
(40, 'Mirja', 'C', 'Obach', 'Female', 'PPA_MirjaObach', 'Administrative Division', 'Procurement Officer B', 5, '$2y$10$QN73LZ1rGpIclWbJF/wFjOlS.zS06QxiE0UHPZEu4pimtNFgrcO/C', 'Mirja_Obach_2024.png', '2024-05-06 03:06:04', '2024-05-06 06:03:52'),
(41, 'Mark Anthony', 'C', 'Gonzales', 'Male', 'PPA_Gonzales', 'Administrative Division', 'Storekeeper', 5, '$2y$10$D2EqHlaF3oBXUG58isRoReO3Rcij.e9wXv5N2VV6v9sQ57Hm8yz/O', 'Mark_Anthony_Gonzales_2024.png', '2024-05-06 03:08:32', '2024-05-06 03:17:56'),
(42, 'Noel', 'G', 'Rosero', 'Male', 'PPA_Rosero', 'Administrative Division', 'Senior Building Electrician B', 6, '$2y$10$VvCsWirffZtWK.1IpDBvIugfu4badFKhAGonWEdSay9wPlS4DpPeO', 'Noel_Rosero_2024.png', '2024-05-06 03:09:14', '2024-05-06 06:46:11'),
(43, 'Joel', 'A', 'Magno', 'Male', 'PPA_Magno', 'Administrative Division', 'Plant Mechanic/Electrician B', 6, '$2y$10$s.E0ksZA8kLm9FhBe8IgMuxovaf8XLy.4fP52DKjqq3E.kiMLSSxC', 'Joel_Magno_2024.png', '2024-05-06 03:09:51', '2024-05-06 06:54:12'),
(44, 'Daryl', 'T', 'Sumanoy', 'Male', 'PPA_DarylSumanoy', 'Administrative Division', 'Driver-Mechanic B', 5, '$2y$10$RhnpkVCwYmcqWOpZhK/tt.C.HBRvoBQM2pN./4mdGN.6kUmUGjHti', 'Daryl_Sumanoy_2024.png', '2024-05-06 03:12:37', '2024-05-06 06:59:04'),
(45, 'Joan', 'G', 'Bongcawel', 'Female', 'PPA_Bongcawel', 'Administrative Division', 'Liaison Aide', 5, '$2y$10$KiJYk9FbkIOKiMlvIRCDm.cRCiCmuLutlYkGRf32QL06K5S8Zq8/W', 'Joan_Bongcawel_2024.png', '2024-05-06 03:12:42', '2024-05-06 03:18:45'),
(47, 'Tedegardo', 'N', 'Garces', 'Male', 'PPA_Garces', 'Port Service Division', 'Harbor Master', 5, '$2y$10$qpeRD395fgbmkg9mihhmuO3rhbG5D4z3pbXYFhkhQEUnHfSNP1Dlu', 'Tedegardo_Garces_2024.png', '2024-05-06 03:19:24', '2024-05-06 03:20:15'),
(48, 'Lilybeth', 'Z', 'Remolino', 'Female', 'PPA_Remolino', 'Port Service Division', 'Chief Safety Officer', 5, '$2y$10$jRsccdxQuqWf6UFENW.Te.a8nPOnynLsOtDesqq84SyR1qgZFYgsS', 'Lilybeth_Remolino_2024.png', '2024-05-06 03:19:57', '2024-05-06 06:11:25'),
(49, 'Rey', 'Y', 'Salaan', 'Male', 'PPA_Salaan', 'Port Service Division', 'Terminal Operations Officer A', 5, '$2y$10$jhcPvbAQBUhDEsyJ3q4zVO/tiPEWOY8LyvuG7diSUE832hKr0cdam', 'Rey_Salaan_2024.png', '2024-05-06 03:20:50', '2024-05-06 06:12:33'),
(50, 'Vimbem Valentino', 'P', 'Merto', 'Male', 'PPA_VimMerto', 'Port Service Division', 'Terminal Operations Officer A', 5, '$2y$10$.hlbwLguqJ/aTBD7RuBW6e8.pB98kgfQJOhuOoZBf4LRxWnFZelry', 'Vimbem_Valentino_Merto_2024.png', '2024-05-06 03:22:54', '2024-05-06 06:13:22'),
(51, 'Ronan', 'A', 'Quiapo', 'Male', 'PPA_Quiapo', 'Port Service Division', 'Port Operations Analyst A', 5, '$2y$10$uEmNPHTh1NGa3Jm1d1gF0.1fQyMDOAqcWeSSnTqw7EYk1zXGFYUvC', 'Ronan_Quiapo_2024.png', '2024-05-06 03:23:25', '2024-05-06 06:14:23'),
(52, 'Simon Eli', 'P', 'Embay', 'Male', 'PPA_Embay', 'Port Service Division', 'Harbor Operations Officer', 5, '$2y$10$.RTXuljbqhAv/SnIBLRJZuSKB7gJggYdWUCs.2klsDwYA7peyrHY.', 'Simon_Eli_Embay_2024.png', '2024-05-06 03:25:10', '2024-05-06 03:31:42'),
(54, 'Jealapril', 'S', 'Fernandez', 'Female', 'PPA_Fernandez', 'Port Service Division', 'Statistician A', 5, '$2y$10$hSuOmW52l/zLmXnTM4AaPeryLZn2K3WiI80EipZEMvWOYhN6vyjtS', 'Jealapril_Fernandez_2024.png', '2024-05-06 03:27:45', '2024-05-06 03:33:16'),
(55, 'Rewel', 'B', 'Bares', 'Female', 'PPA_Bares', 'Port Service Division', 'Clerk Processor A', 5, '$2y$10$rvefQjATlyFqdo9gHY6DW.RKo.QhcNJ0aduj3cCgy5YluJEL4cIjq', 'Rewel_Bares_2024.png', '2024-05-06 03:29:29', '2024-05-06 03:32:33'),
(56, 'Lorgie Mae', 'A', 'Tumbagahan', 'Female', 'PPA_Tumbagahan', 'Port Service Division', 'Statistician A', 5, '$2y$10$z89/FILyN/EmJv5j701lYu.AJEXTjYk1COpyWHaNXSVsUAuG4F8.W', 'Lorgie_Mae_Tumbagahan_2024.png', '2024-05-06 03:30:23', '2024-05-06 06:19:19'),
(57, 'J. Wenceslao', 'S', 'Rosete', 'Male', 'PPA_Rosete', 'Port Police Division', 'Civil Security Officer A (Senior Port Police Inspector)', 5, '$2y$10$1VSz6x2n.w1B0.8M32IFdu7U4lO2MDkaKGRX1LGeqJXIMfx6XHnW2', 'J._Wenceslao_Rosete_2024.png', '2024-05-06 03:32:20', '2024-05-06 06:26:50'),
(58, 'Colin Kay', 'R', 'Cajote', 'Female', 'PPA_Cajote', 'Engineering Service Division', 'Supervising Engineer A', 5, '$2y$10$x9ml3m/xHS1XIZrQtzTqkejaHbME5ugwPra/KrVaabYw3SIIQln6W', 'Colin_Kay_Cajote_2024.png', '2024-05-06 03:34:57', '2024-05-06 06:24:04'),
(59, 'Arnel', 'C', 'Oclarino', 'Male', 'PPA_Oclarino', 'Engineering Service Division', 'Senior Engineer A', 5, '$2y$10$d4TL0io4RLY.2Q99/aJh5uVyo9xhz5fScNygjuFIV0SaEiIxwc9rq', 'Arnel_Oclarino_2024.png', '2024-05-06 03:36:51', '2024-05-06 06:25:40'),
(60, 'Lawrence', 'M', 'Bersaldo', 'Male', 'PPA_Bersaldo', 'Port Police Division', 'Civil Security Officer C (Port Police Officer II)', 5, '$2y$10$Dgo4erFVYPR.9SYaSAFl3Oo62h9HyX99ymCTLYcNeLMIiEwdt5hwK', 'Lawrence_Bersaldo_2024.png', '2024-05-06 03:37:13', '2024-05-06 06:23:34'),
(61, 'Luis', 'A', 'Calderon', 'Male', 'PPA_Calderon', 'Engineering Service Division', 'Construction Foreman A', 5, '$2y$10$CmVIPgTGerNDy/o8GK1zhOn7jmtpPNVD0OMBaFP8WR5TxJHVkc0yu', 'Luis_Calderon_2024.png', '2024-05-06 03:38:22', '2024-05-06 06:24:34'),
(62, 'Dennis', 'S', 'Cambaya', 'Male', 'PPA_Cambaya', 'Engineering Service Division', 'Engineering Assistant A', 5, '$2y$10$meRw9jBsEQXeEDRGHxbcoOVN8A3lVZokd6kzBKaF5MNxLepqY.yuK', 'Dennis_Cambaya_2024.png', '2024-05-06 03:39:53', '2024-05-06 06:25:17'),
(63, 'Tristan Luke', 'C', 'Misa', 'Male', 'PPA_Misa', 'Port Police Division', 'Industrial Security Officer (Port Police Officer I)', 5, '$2y$10$0mLDhwx7FIsxUpEKAWkwoeT7g6oRD2RtlnYrY2vSUA6nRexqS5LaK', 'Tristan_Luke_Misa_2024.png', '2024-05-06 03:40:02', '2024-05-06 06:28:11'),
(64, 'Clint Bryan', 'B', 'Balmores', 'Male', 'PPA_Balmores', 'Terminal Management Office - Tubod', 'Collection Representative A', 6, '$2y$10$6X9v.htjROQKb.XJJsf2jeUdXXDwytbd174myXMoAvZQCj3PNOLgm', 'Clint_Bryan_Balmores_2024.png', '2024-05-06 03:42:10', '2024-05-06 06:57:26'),
(65, 'Jennifer Anne', 'S', 'Ganaden', 'Female', 'PPA_Ganaden', 'Terminal Management Office - Tubod', 'Cashier B', 5, '$2y$10$aYa0M8lmCghFMIyvUVw5..1510NLU5JHrUKQTfu3F17JJd9TcrZMm', 'Jennifer_Anne_Ganaden_2024.png', '2024-05-06 03:43:58', '2024-05-06 06:25:57'),
(66, 'Helbert', 'L', 'Marzon', 'Male', 'PPA_Marzon', 'Port Police Division', 'Civil Security Officer C (Port Police Officer II)', 5, '$2y$10$1Dhp7DIFBA0ww/c2sBqyreQpD5BjB5tYtQemCQsadXLsyeKHCXpZu', 'Helbert_Marzon_2024.png', '2024-05-06 03:45:11', '2024-05-06 06:29:01'),
(67, 'Aldrin', 'B', 'Denopol', 'Male', 'PPA_Denopol', 'Office of the Port Manager', 'Data Encoder lll', 6, '$2y$10$3os5mPe/de/SYkLWeTX4FORpUVCy8cMxkXgyPhT0.fVZhtA3I8r1u', 'Aldrin_Denopol_2024.png', '2024-05-06 03:46:52', '2024-05-06 06:41:37'),
(68, 'Queen Blaire', 'B', 'Unabia', 'Female', 'PPA_Unabia', 'Port Police Division', 'Industrial Security Officer (Port Police Officer I)', 5, '$2y$10$uSnsiOOFk1uUWxNO/TVgh.mRN.NI9seToZmjKTtRykNmtFFUOk7tq', 'Queen_Blaire_Unabia_2024.png', '2024-05-06 03:47:46', '2024-05-06 06:29:50'),
(69, 'Ryan', 'J', 'Seville', 'Male', 'PPA_Seville', 'Office of the Port Manager', 'Utility Worker', 6, '$2y$10$X2Mipt1vxDylIpES.N.WY.aYfYA0AOS7awDhlYs75E97okvwRPnuK', 'Ryan_Seville_2024.png', '2024-05-06 03:48:39', '2024-05-06 06:51:59'),
(70, 'Evelyn', 'C', 'Tambus', 'Female', 'PPA_Tambus', 'Office of the Port Manager', 'Utility Worker', 6, '$2y$10$vag1XcWSPzMsj5DcI5MU4eOzwRjEZabs2mQme9WQFUpXpdxsh3QFy', 'Evelyn_Tambus_2024.png', '2024-05-06 03:49:52', '2024-05-06 06:53:19'),
(71, 'Japheth', 'T', 'Sumingit', 'Male', 'PPA_Sumingit', 'Port Police Division', 'Industrial Security Officer (Port Police Officer I)', 5, '$2y$10$gU1zUI8PbIzUVvQlMuzwpeoMEInqUPTLHjf5S.TBsCvckokuOMVAC', 'Japheth_Sumingit_2024.png', '2024-05-06 03:50:30', '2024-05-06 06:30:37'),
(72, 'Ricardo', 'S', 'Villanueva', 'Male', 'PPA_Villanueva', 'Office of the Port Manager', 'Driver Mechanic B', 5, '$2y$10$.JJv5ld2DwGdnWbDslR1tO6rK2036EkF8gDAY.25tPINIEeBOeGhK', 'Ricardo_Villanueva_2024.png', '2024-05-06 03:52:42', '2024-05-06 06:59:11'),
(73, 'Arlene', 'L', 'Acierto', 'Female', 'PPA_Acierto', 'Finance Division', 'Data Encoder lll', 5, '$2y$10$LY6ra01OlZVB3ISJymqjJOh.GQuqdETAyzO/wMM9k4ZWkbmpWZBzm', 'Arlene_Acierto_2024.png', '2024-05-06 03:58:01', '2024-05-06 05:45:00'),
(74, 'Laybert', 'S', 'Bakiki', 'Male', 'PPA_Bakiki', 'Finance Division', 'Data Encoder lll', 5, '$2y$10$PSkgMO/pXbVtBAV6Jr7jy.C2QqVWRiXMa5hwu2FVPCYV.TxQ.05KK', 'Laybert_Bakiki_2024.png', '2024-05-06 04:02:00', '2024-05-06 05:48:01'),
(75, 'Marilou', 'V', 'Duguil', 'Female', 'PPA_Duguil', 'Finance Division', 'Administrative Aide lll', 5, '$2y$10$oB0j1ars4movS8vZDh5JcOO3/S7Rx2oDk6XZAY9kSyXeN.qY9PEBO', 'Marilou_Duguil_2024.png', '2024-05-06 04:04:10', '2024-05-06 06:19:41'),
(76, 'Nelson', 'V', 'Duguil', 'Male', 'PPA_NelDuguil', 'Finance Division', 'Cash Clerk lll', 5, '$2y$10$IYA66nXvae3lGD7jAAU1beK.BAvLOxm0jH1SrWpP4Jf0TPfl/.bt2', 'Nelson_Duguil_2024.png', '2024-05-06 04:06:00', '2024-05-06 05:49:39'),
(77, 'Richie Aram', 'B', 'Garganera', 'Male', 'PPA_Garganera', 'Administrative Division', 'Administrative Services Assistant II', 5, '$2y$10$b6RMf9puUVq0BiqKNDh4b.Tn2JuWl7YDQi26g2CKolAp3/3f2CvqG', 'Richie_Aram_Garganera_2024.png', '2024-05-06 04:06:55', '2024-05-06 04:06:55'),
(78, 'Joshua Raiben', 'M', 'Padilla', 'Male', 'PPA_Padilla', 'Finance Division', 'Data Encoder lll', 5, '$2y$10$K90f3ho3PtFEsbROU1W5n.6loAG5vubCET/piWwGccWNBb.f9eVqe', 'Joshua_Raiben_Padilla_2024.png', '2024-05-06 04:08:29', '2024-05-06 05:45:33'),
(79, 'Jocelyn', 'R', 'Petallo', 'Female', 'PPA_Petallo', 'Finance Division', 'Utility Worker', 5, '$2y$10$OWeV/hge8mIlyDMuy2M5RevsKGHp/TpHgZCPSH/3xnsAez9XESNIq', 'Jocelyn_Petallo_2024.png', '2024-05-06 04:09:59', '2024-05-06 06:02:24'),
(80, 'Jonjon', 'A', 'Senajon', 'Male', 'PPA_Senajon', 'Finance Division', 'Cash Clerk lll', 5, '$2y$10$8gIlqc62U1WKUPItpJi6fOLlibjIdu4sCtTusIs9jxB4R.RcNP8eW', 'Jonjon_Senajon_2024.png', '2024-05-06 04:11:04', '2024-05-06 05:49:13'),
(81, 'Judylyn', 'C', 'Velez', 'Female', 'PPA_Velez', 'Finance Division', 'Data Encoder lll', 5, '$2y$10$bVIFMxuzGDB.Q3ga3jUOu.x.5yJW6jZERjL4CH8VnskrrBJQAZ2wa', 'Judylyn_Velez_2024.png', '2024-05-06 04:13:27', '2024-05-06 05:46:40'),
(82, 'Juan Vicente', 'J', 'Torres', 'Male', 'PPA_Torres', 'Finance Division', 'Clerk lV', 5, '$2y$10$.tGoXtMK6pSYz3./iYbhWemYXAtOupUMLIukeUrxerVU8u6yMhWEO', 'Juan_Vicente_Torres_2024.png', '2024-05-06 04:14:11', '2024-05-06 05:50:01'),
(83, 'Ricky', 'M', 'Villaver', 'Male', 'PPA_RickyVillaver', 'Finance Division', 'Data Encoder lll', 5, '$2y$10$xOIWhqdr0ldAWe2fbjo3teGrFZBd5RkhUFLp1.PhMGXhKMDMqtNb2', 'Ricky_Villaver_2024.png', '2024-05-06 04:16:53', '2024-05-06 05:47:08'),
(84, 'Levi', 'R', 'Villondo', 'Male', 'PPA_Villondo', 'Finance Division', 'Data Encoder lll', 5, '$2y$10$IzQWt.aB83A8PNZQ1nBN7eVwJ/1CgBEQPbTqiK4UxEeaLddxs0eCK', 'Levi_Villondo_2024.png', '2024-05-06 04:17:00', '2024-05-06 05:47:36'),
(85, 'Bertito', 'E', 'Abaquita', 'Male', 'PPA_Abaquita', 'Administrative Division', 'Sr. Reproduction Machine Operator', 5, '$2y$10$ToSoM3v.c2rXsLVtHtpIXexdlIVJOxux.HzMcEKBSylGYXEJhdepa', 'Bertito_Abaquita_2024.png', '2024-05-06 04:19:14', '2024-05-06 05:41:37'),
(86, 'Stephen', 'E', 'Acierto', 'Male', 'PPA_StephenAcierto', 'Administrative Division', 'Plant Mechanic /Electrician B', 6, '$2y$10$sCZeitBUbsLAO/DKAfHnpO5h9M2PddwxX4pJi0MAj3Y2YhJ2n1zWi', 'Stephen_Acierto_2024.png', '2024-05-06 04:19:48', '2024-05-06 06:44:42'),
(87, 'Jason', 'S', 'Alindayo', 'Male', 'PPA_JasonAlindayo', 'Administrative Division', 'Utility Worker', 6, '$2y$10$ARQU9uE3.hn.oyak4bL28OvsUij1YZXrVHVBtJ81cG4.QbFdS.maG', 'Jason_Alindayo_2024.png', '2024-05-06 04:21:16', '2024-05-06 06:41:13'),
(88, 'Reynaldo', 'P', 'Alindayo', 'Male', 'PPA_ReyAlindayo', 'Administrative Division', 'Senior Carpenter', 6, '$2y$10$MAvu.elfP0iPHHYc78RNZe62vixMlsdF9aS.d5a7yBUMfmsWtkqWm', 'Reynaldo_Alindayo_2024.png', '2024-05-06 04:22:32', '2024-05-06 06:43:33'),
(89, 'Jesril', 'D', 'Ampo', 'Male', 'PPA_Ampo', 'Administrative Division', 'Administrative Aide lll', 6, '$2y$10$CuiRiQ86sRZ8JIhJ/IZaX.Gzn.RRSF3acSqnEAZn9dTIblA.MuxWK', 'Jesril_Ampo_2024.png', '2024-05-06 04:24:14', '2024-05-06 06:52:41'),
(90, 'Noel', 'U', 'Balolong', 'Male', 'PPA_Balolong', 'Administrative Division', 'Plumber A', 6, '$2y$10$wjLzK.9CpUR8QCXeI7fCuuuwxAKy/yZRvgPSZJM39h8XMpHzf0L96', 'Noel_Balolong_2024.png', '2024-05-06 04:25:28', '2024-05-06 06:46:36'),
(91, 'Jerome', 'C', 'Diango', 'Male', 'PPA_Diango', 'Administrative Division', 'Mason ll (A)', 6, '$2y$10$qkgsAz52ln/5d5PmAVmOYe.c0ErWtUPmgzNlHnt0UwH4assiz9ZTS', 'Jerome_Diango_2024.png', '2024-05-06 04:27:19', '2024-05-06 06:49:19'),
(92, 'Adonis Mc Gabby', 'Ll', 'Dingcong', 'Male', 'PPA_Dingcong', 'Administrative Division', 'Computer Operator IV', 6, '$2y$10$hjmdH23zqphX6AMryFCcDesi0EGDOi/wEtm8Ednj6GVkNZ10QUNxS', 'Adonis_Mc_Gabby_Dingcong_2024.png', '2024-05-06 04:27:53', '2024-05-06 06:40:35'),
(93, 'Jon Carlo', 'D', 'Gallarde', 'Male', 'PPA_Gallarde', 'Administrative Division', 'Mechanic/Technician lll', 6, '$2y$10$jA7kWMXomV/NT8i3l7WBB.fhEUufXv/uzV/SxTCLM6RtcgoMWTWXG', 'Jon_Carlo_Gallarde_2024.png', '2024-05-06 04:28:44', '2024-05-06 06:45:55'),
(94, 'Genny', 'M', 'Gandillo', 'Male', 'PPA_Gandillo', 'Administrative Division', 'Painter ll (A)', 6, '$2y$10$dmB2Q0baS9NWTOZ5akFjWeiQPXXhkGiQseWjW4zmvsOChbPeW0jNe', 'Genny_Gandillo_2024.png', '2024-05-06 04:29:58', '2024-05-06 06:42:33'),
(95, 'Michael Alfe', 'E', 'Guillena', 'Male', 'PPA_Guillena', 'Administrative Division', 'Utility Worker', 6, '$2y$10$AqDdxuPEqStj82nM60IxrOhVN/zn1H3/JxZ7gDFQYneMmNelHoao.', 'Michael_Alfe_Guillena_2024.png', '2024-05-06 04:30:18', '2024-05-06 06:45:14'),
(97, 'Kharen Joy', 'B', 'Jerusalem', 'Female', 'PPA_Jerusalem', 'Administrative Division', 'Clerk lV', 5, '$2y$10$8xUNKmhjpFwElus4D9Vqte4mZGCNjND6jDjv902qKloQATyctacUS', 'Kharen_Joy_Jerusalem_2024.png', '2024-05-06 04:32:53', '2024-05-06 05:54:58'),
(99, 'Jay Robin', 'S', 'Lluisma', 'Male', 'PPA_Lluisma', 'Administrative Division', 'Electronics Communication System Operator A', 6, '$2y$10$QSc8OBDZajwNK5pwPXMDXe.BkSkMvv0uReV9HG/2vJsu6Q1sQldfq', 'Jay_Robin_Lluisma_2024.png', '2024-05-06 04:35:06', '2024-05-06 06:42:11'),
(100, 'Fatima', 'D', 'Meralles', 'Female', 'PPA_Meralles', 'Administrative Division', 'Utility Worker', 6, '$2y$10$mIYuZV/qh7NsA9fDNfH8z.yzaf0uXia0kBJmZHm1cZjncb3QdV.J6', 'Fatima_Meralles_2024.png', '2024-05-06 04:36:42', '2024-05-06 06:46:29'),
(101, 'Edward Sonny', 'B', 'Namindang', 'Male', 'PPA_Namindang', 'Administrative Division', 'Electronics Communication System Operator A', 6, '$2y$10$V5Zrns0k4Pv5G/vhr2NY0OBxCX0CEc5g8i.Ugjk2uapgW6kxr6Saa', 'Edward_Sonny_Namindang_2024.png', '2024-05-06 04:37:28', '2024-05-06 06:42:58'),
(102, 'Neirmae', 'A', 'Pagente', 'Female', 'PPA_Pagente', 'Administrative Division', 'Utility Worker', 6, '$2y$10$Iza746rBMl.1nzyeltyNnOyydO81aC1smoDF3R3T0h/yl7jF1/oBe', 'Neirmae_Pagente_2024.png', '2024-05-06 04:39:57', '2024-05-06 06:48:44'),
(103, 'Locyl', 'L', 'Petallo', 'Female', 'PPA_LocylPetallo', 'Administrative Division', 'Utility Worker', 6, '$2y$10$rpK4CmBzM/pIryryuM007ecofFosX79Wd9h8ozSYplBFQvCVPszgW', 'Locyl_Petallo_2024.png', '2024-05-06 04:41:19', '2024-05-06 06:50:42'),
(104, 'Lorenzo', 'G', 'Romeo', 'Male', 'PPA_Romeo', 'Administrative Division', 'Utility Worker', 6, '$2y$10$MmWDUnHyIxiA/yM3IeW0tey2jGl4wSs62Z/fkxoWErQePBVRd3mf.', 'Lorenzo_Romeo_2024.png', '2024-05-06 04:43:10', '2024-05-06 06:51:26'),
(105, 'Mary Ann', 'P', 'Rosete', 'Female', 'PPA_MaryRosete', 'Administrative Division', 'Data Encoder lll', 5, '$2y$10$U4fQUANODu3CTsNkdtf/JOBkZVoUToywzOgtJx4BKxHt8X7LWdauW', 'Mary_Ann_Rosete_2024.png', '2024-05-06 04:45:10', '2024-05-06 05:44:17'),
(106, 'Michael', 'G', 'Sade', 'Male', 'PPA_MichaelSade', 'Administrative Division', 'Administrative Aide lll', 6, '$2y$10$nP/jEg/tF2e/5WaPM/VsMOtjMys1QAKhUQoA/4GUFP5aBy6k65F7u', 'Michael_Sade_2024.png', '2024-05-06 04:46:06', '2024-05-06 06:51:40'),
(107, 'John Ian', 'S', 'Obach', 'Male', 'PPA_IanObach', 'Administrative Division', 'Nurse ll', 5, '$2y$10$JSzR/.T9.2z6Skps9FA4cOJbE/kO1/puB0ovKeAErdhW9dQ57BQAO', 'John_Ian_Obach_2024.png', '2024-05-06 04:48:40', '2024-05-06 05:53:16'),
(108, 'Melvic', 'S', 'Opema', 'Male', 'PPA_Opema', 'Administrative Division', 'Computer Programmer', 10, '$2y$10$Cl8eYeRY5HKvwC.RfZ5rCeO6DwBslwZlEgyFijDtpSgKZnoFwPCJW', 'Melvic_Opema_2024.png', '2024-05-06 04:49:24', '2024-05-06 06:35:22'),
(109, 'Angelo', 'P', 'Serafin', 'Male', 'PPA_Serafin', 'Administrative Division', 'Administrative Aide lll', 6, '$2y$10$3vCsetB1ZmXUWa1fu2o9c.teqmWFi9lzymhCQE8aK8JNiWpkkxBa2', 'Angelo_Serafin_2024.png', '2024-05-06 04:52:42', '2024-05-06 06:52:18'),
(110, 'Darwin', 'T', 'Sumanoy', 'Male', 'PPA_Sumanoy', 'Administrative Division', 'Utility Worker', 6, '$2y$10$2jfK2M1XAqg0skn3KJYPbuyU10w0qQcBJHkoltr2a/T3BN2RtHzya', 'Darwin_Sumanoy_2024.png', '2024-05-06 04:54:36', '2024-05-06 06:52:41'),
(112, 'Erwin', 'Y', 'Villaver', 'Male', 'PPA_ErwinVillaver', 'Administrative Division', 'Utility Worker', 6, '$2y$10$hP4BnUf4zeYocxRn/kHwY.lYLr84nGDfJfWwhFY0UNWs4dCPqfk/K', 'Erwin_Villaver_2024.png', '2024-05-06 04:58:34', '2024-05-06 06:53:57'),
(113, 'Lorena', 'A', 'Tamula', 'Female', 'PPA_Tamula', 'Port Service Division', 'Utility Worker', 5, '$2y$10$hrywvaX1r6U0AEepeoLd4eyq25VkQroyXcEZ5FMVNnfChO4GEIova', 'Lorena_Tamula_2024.png', '2024-05-06 04:58:51', '2024-05-06 06:21:39'),
(114, 'Rowe', 'P', 'Panuncillo', 'Male', 'PPA_Panuncillo', 'Port Service Division', 'Utility Worker', 6, '$2y$10$mrw9CNlDxBl0uitQU8B/FeG9ZN4v4OjOW/SYpwYcxIa5sgY8nqChi', 'Rowe_Panuncillo_2024.png', '2024-05-06 05:00:50', '2024-05-06 06:49:59'),
(115, 'Joseph Anthony', 'L', 'Suangco', 'Male', 'PPA_JosephSuangco', 'Port Service Division', 'Data Encoder lll', 5, '$2y$10$rpq3x5TQtBVesxST8q..Vu3ufeZPLfI/9WBjYTYSzJCYADgd2x29G', 'Joseph_Anthony_Suangco_2024.png', '2024-05-06 05:00:58', '2024-05-06 05:59:35'),
(116, 'Muwhar', 'L', 'Canoy', 'Male', 'PPA_Canoy', 'Port Service Division', 'Information Assistant II', 5, '$2y$10$QCpAKtfZR.1S5DZLnojgoO330VnGMeL22MVI.ktsWb4q1dmw0SlXC', 'Muwhar_Canoy_2024.png', '2024-05-06 05:02:13', '2024-05-06 05:59:57'),
(117, 'Rechievue', 'Y', 'Villaver', 'Male', 'PPA_Villaver', 'Port Service Division', 'Utility Worker', 6, '$2y$10$HtrLJb8Qd8BJ4Wn9tRMGR.FyHY9B2eDO2Gh8DfqGUsONQOmKeGBL6', 'Rechievue_Villaver_2024.png', '2024-05-06 05:03:05', '2024-05-06 06:53:19'),
(118, 'Archer', 'A', 'Dahunan', 'Male', 'PPA_Dahunan', 'Engineering Service Division', 'Senior Welder', 6, '$2y$10$MAGRJDNnbqqFhvb7XII6Z.u8s1laakWWF8A4Ju2Ow0DUyFooD9O1.', 'Archer_Dahunan_2024.png', '2024-05-06 05:04:53', '2024-05-06 06:48:50'),
(119, 'Mervin Angelou', 'Q', 'Faeldin', 'Male', 'PPA_Faeldin', 'Engineering Service Division', 'Clerk lV', 5, '$2y$10$1z6ojY9SUgwLL./HUcwMced/iAwZvdMqROhO4kmJChJZVRdCNnlDa', 'Mervin_Angelou_Faeldin_2024.png', '2024-05-06 05:06:22', '2024-05-06 05:55:46'),
(120, 'Mark Jason', 'I', 'Gengone', 'Male', 'PPA_Gengone', 'Engineering Service Division', 'Electrician', 6, '$2y$10$/SBY7Uz4CxQjSQ2unKaDpODluXAz3uV8Is6WC1XoK3ZZN6oy1kgd6', 'Mark_Jason_Gengone_2024.png', '2024-05-06 05:06:52', '2024-05-06 06:48:15'),
(121, 'Mychel Melchor', 'K', 'Nuevas', 'Male', 'PPA_Nuevas', 'Engineering Service Division', 'Data Encoder lll', 5, '$2y$10$3sQQOGBT0cKSXHzuZgY.uutkWk8OXmKs5wHrKiIouF6XXbBgWF.GK', 'Mychel_Melchor_Nuevas_2024.png', '2024-05-06 05:08:39', '2024-05-06 05:55:26'),
(122, 'Jolito', 'S', 'Sepio', 'Male', 'PPA_Sepio', 'Engineering Service Division', 'Mason ll (A)', 6, '$2y$10$ME47o2Tl8/0Nj0VZhl9RHuUCReyw0L06qqH710pYdyIfWmRuXdg0y', 'Jolito_Sepio_2024.png', '2024-05-06 05:09:00', '2024-05-06 06:47:12'),
(123, 'Charlotte', 'A', 'Castaño', 'Female', 'PPA_Castaño', 'Finance Division', 'Cash Clerk lll', 5, '$2y$10$Gsx1OEFh4rpa17SmPcEWfODRMIUwPiRgpBen/f6uBRqWK.nM/TsEy', 'Charlotte_Castaño_2024.png', '2024-05-06 05:31:00', '2024-05-06 05:48:47'),
(124, 'Earl', 'S', 'Coquilla', 'Male', 'PPA_Coquilla', 'Port Police Division', 'Electronics Communication System Operator A', 6, '$2y$10$hniBSJumgJGxj0QdsBtQ1esE/QHvE8hngipymYc5SdTVG3PmslPDK', 'Earl_Coquilla_2024.png', '2024-05-06 05:32:46', '2024-05-06 06:39:58'),
(125, 'Almudzni', 'J', 'Desierto', 'Male', 'PPA_Desierto', 'Port Police Division', 'Electronics Communication System Operator A', 5, '$2y$10$.LgjkKywq586aKYKD4ZMCOXo1C6lGNbSIC9vuYqEaLEqPQl90vjPu', 'Almudzni_Desierto_2024.png', '2024-05-06 05:34:23', '2024-05-06 05:34:23'),
(126, 'Joy', 'D', 'Celocia', 'Male', 'PPA_Celocia', 'Terminal Management Office - Tubod', 'Utility Worker', 5, '$2y$10$9Fk.G5Q3apIJvTvBPAVJouPrPJkQ0ZSJ3ak9mf0Xv4/XxfdZOyp8S', 'Joy_Celocia_2024.png', '2024-05-06 05:36:14', '2024-05-06 05:40:35'),
(127, 'Nilo John', 'C', 'Milmao', 'Male', 'PPA_Milmao', 'Terminal Management Office - Tubod', 'Clerk lV', 6, '$2y$10$AGWN4rxXCk7IF1HdkajqAOjoHqFC16e0GbAT8WPOJWaU1BJXE9/t2', 'Nilo_John_Milmao_2024.png', '2024-05-06 05:37:45', '2024-05-06 06:51:13'),
(128, 'Allan', 'C', 'Balbarino', 'Male', 'PPA_Balbarino', 'Terminal Management Office - Tubod', 'Administrative Aide lll', 6, '$2y$10$jooNeRJNA/KVmUHCVkUSZeyS9Lj7Tlg.fC6h4CASCThiT/gQuMjT6', 'Allan_Balbarino_2024.png', '2024-05-06 05:38:46', '2024-05-06 06:50:44'),
(129, 'Anabel', 'I', 'Pagente', 'Female', 'PPA_AnabelPagente', 'Finance Division', 'Senior Accounting Processor B', 5, '$2y$10$9E.Rel6TTMURZRUy2R0Y7eFOQhvkx2J.uA5pmfNwJVPeWyAw7U4FG', 'Anabel_Pagente_2024.png', '2024-05-06 05:56:23', '2024-05-06 05:56:23'),
(130, 'Corinne', 'D', 'Madrio', 'Female', 'PPA_Madrio', 'Port Police Division', 'Information Assistant II', 5, '$2y$10$vW1YaR3l0QqXF1lQkT24x.fIhQvIqZRHF2LIu5Y8a0eFmYFuYO5Am', 'Corinne_Madrio_2024.png', '2024-05-06 05:58:56', '2024-05-06 05:58:56'),
(131, 'Julito', 'S', 'Villacorte', 'Male', 'PPA_Villacorte', 'Engineering Service Division', 'Senior Carpenter', 6, '$2y$10$FE/xAqB.DXSL0qbeQlPmpeLrjlBuqLOA52bgAeAuda1BdF4ecT/cO', 'Julito_Villacorte_2024.png', '2024-05-06 06:17:48', '2024-05-06 06:47:41');

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
  `remarks` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `equipment_form`
--
ALTER TABLE `equipment_form`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `facility`
--
ALTER TABLE `facility`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inspection_form_admin`
--
ALTER TABLE `inspection_form_admin`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inspection__forms`
--
ALTER TABLE `inspection__forms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inspector__forms`
--
ALTER TABLE `inspector__forms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1440;

--
-- AUTO_INCREMENT for table `p_p_a_users`
--
ALTER TABLE `p_p_a_users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vehicle_slip`
--
ALTER TABLE `vehicle_slip`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
