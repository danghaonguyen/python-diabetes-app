-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 05, 2025 lúc 02:01 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `diabetes_app`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `predictions`
--

CREATE TABLE `predictions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` tinyint(4) DEFAULT NULL,
  `pulse_rate` int(11) DEFAULT NULL,
  `systolic_bp` int(11) DEFAULT NULL,
  `diastolic_bp` int(11) DEFAULT NULL,
  `glucose` float DEFAULT NULL,
  `height` float DEFAULT NULL,
  `weight` float DEFAULT NULL,
  `bmi` float DEFAULT NULL,
  `family_diabetes` tinyint(4) DEFAULT NULL,
  `hypertensive` tinyint(4) DEFAULT NULL,
  `family_hypertension` tinyint(4) DEFAULT NULL,
  `cardiovascular_disease` tinyint(4) DEFAULT NULL,
  `stroke` tinyint(4) DEFAULT NULL,
  `prediction_result` varchar(100) DEFAULT NULL,
  `prediction_probability` float DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `predictions`
--

INSERT INTO `predictions` (`id`, `user_id`, `age`, `gender`, `pulse_rate`, `systolic_bp`, `diastolic_bp`, `glucose`, `height`, `weight`, `bmi`, `family_diabetes`, `hypertensive`, `family_hypertension`, `cardiovascular_disease`, `stroke`, `prediction_result`, `prediction_probability`, `created_at`) VALUES
(16, 10, 65, 1, 80, 155, 95, 9.5, 1.65, 95, 34.89, 1, 1, 1, 1, 0, 'Cao', 0.997, '2025-06-08 18:26:55'),
(18, 12, 50, 1, 80, 130, 85, 7.2, 1.7, 75, 25.95, 0, 0, 0, 0, 0, 'Trung bình', 0.57, '2025-06-08 21:47:23'),
(19, 12, 50, 1, 76, 130, 85, 7.2, 1.7, 75, 25.95, 0, 0, 0, 0, 0, 'Trung bình', 0.558, '2025-06-08 21:47:32'),
(22, 10, 80, 1, 76, 130, 85, 7.2, 1.7, 75, 25.95, 0, 0, 0, 0, 0, 'Cao', 0.624, '2025-06-15 22:44:24'),
(24, 10, 50, 1, 76, 85, 130, 7.2, 1.7, 75, 25.95, 0, 0, 0, 0, 0, 'Cao', 0.753, '2025-06-15 22:44:59'),
(26, 10, 30, 1, 70, 120, 80, 5, 1.7, 60, 20.76, 0, 0, 0, 0, 0, 'Thấp', 0.193, '2025-06-15 22:55:26'),
(29, 10, 50, 0, 76, 130, 85, 7.2, 1.7, 75, 25.95, 0, 0, 0, 1, 0, 'Cao', 0.768, '2025-06-16 21:37:41'),
(30, 10, 50, 0, 76, 130, 85, 7.2, 1.7, 75, 25.95, 0, 0, 0, 0, 0, 'Trung bình', 0.52, '2025-06-16 21:46:21'),
(49, 10, 50, 1, 76, 130, 85, 7.2, 1.7, 75, 25.95, 0, 0, 0, 0, 0, 'Trung bình', 0.558, '2025-06-20 19:04:41'),
(50, 10, 50, 1, 76, 130, 85, 7.2, 1.7, 75, 25.95, 0, 0, 1, 0, 0, 'Cao', 0.737, '2025-06-20 19:07:35'),
(55, 10, 50, 0, 80, 155, 95, 9.5, 1.7, 95, 32.87, 0, 0, 0, 0, 0, 'Cao', 0.866, '2025-06-25 22:54:16'),
(57, 17, 50, 1, 76, 130, 85, 7.2, 1.7, 75, 25.95, 0, 0, 0, 0, 0, 'Trung bình', 0.558, '2025-07-02 20:56:18'),
(59, 17, 70, 0, 78, 140, 90, 9.2, 1.7, 80, 27.68, 0, 0, 0, 0, 1, 'Cao', 0.729, '2025-07-03 15:17:40'),
(62, 17, 80, 0, 76, 155, 86, 7.2, 1.7, 75, 25.95, 0, 0, 0, 0, 0, 'Trung bình', 0.58, '2025-07-03 15:43:50'),
(73, 17, 60, 0, 95, 145, 95, 8.5, 1.55, 78, 32.47, 1, 1, 1, 1, 1, 'Cao', 0.985, '2025-07-03 16:21:34'),
(77, 17, 60, 0, 80, 130, 85, 8.5, 1.55, 78, 32.47, 0, 0, 0, 0, 0, 'Trung bình', 0.587, '2025-07-03 16:22:09'),
(80, 17, 45, 0, 82, 130, 85, 6.5, 1.58, 68, 27.24, 1, 1, 1, 0, 0, 'Cao', 0.862, '2025-07-03 16:25:50'),
(94, 17, 46, 0, 82, 130, 85, 6.5, 1.58, 68, 27.24, 1, 0, 0, 0, 0, 'Thấp', 0.157, '2025-07-03 16:35:13'),
(111, 10, 50, 1, 76, 130, 85, 7.2, 1.7, 75, 25.95, 0, 0, 0, 0, 0, 'Trung bình', 0.558, '2025-07-05 17:22:33'),
(112, 10, 80, 1, 80, 131, 86, 8, 1.7, 75, 25.95, 0, 0, 0, 0, 0, 'Cao', 0.688, '2025-07-05 17:59:39');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `username` varchar(100) DEFAULT NULL,
  `reset_code` varchar(10) DEFAULT NULL,
  `reset_code_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `created_at`, `username`, `reset_code`, `reset_code_expiry`) VALUES
(10, 'vinaihn@gmail.com', 'scrypt:32768:8:1$muHWivF1BZBqtOAG$a1dd3c96416b881e58f7216a5383ffdb898eeaa4395a94e18401803c3f56fd64579d3be904383f808297afe6815eac01ad267d160cf297151da5a9f427ea09bd', '2025-06-03 08:07:12', 'Hào Nguyên', NULL, NULL),
(12, 'thayhkk@gmail.com', 'scrypt:32768:8:1$TUnri34MsofHAOvu$ece46ed32174839a6e2e2df757fe75b60d1647558ff8f372620649f62effd0288d893cc956c0ad98454bbaa6947f2ade25a60015bd937466b4e3f3349eb89040', '2025-06-08 14:46:50', 'Đặng Hào Nguyên', NULL, NULL),
(17, 'nguyentinovn@gmail.com', 'scrypt:32768:8:1$3cm3onj3BMG6rHt5$1298a7a8b5bd86ac341357bda91e82bf100a2bc0803d823432d0fb1e9e7a14bc3527c70378320eaea1fb1a612802d2ae01def8f0fbd49dba35069e3681699d1b', '2025-07-02 13:55:47', 'Hào Nguyên 2', NULL, NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `predictions`
--
ALTER TABLE `predictions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `predictions`
--
ALTER TABLE `predictions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `predictions`
--
ALTER TABLE `predictions`
  ADD CONSTRAINT `predictions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
