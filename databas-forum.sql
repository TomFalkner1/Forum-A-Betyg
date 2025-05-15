-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Värd: 127.0.0.1
-- Tid vid skapande: 15 maj 2025 kl 12:56
-- Serverversion: 10.4.32-MariaDB
-- PHP-version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `databas-forum`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `room_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `username`, `message`, `created_at`, `room_id`) VALUES
(1, 'tester1', 'kom igen nu', '2025-05-14 11:05:57', 1),
(2, 'tester1', 'test', '2025-05-14 11:06:51', 1),
(3, 'tester1', 'test', '2025-05-14 11:26:21', 1),
(4, 'tester2', 'awdad', '2025-05-14 11:29:55', 1),
(5, 'tester1', 'yes', '2025-05-14 11:32:19', 1),
(6, 'tester1', 'test', '2025-05-14 11:36:47', 2),
(7, 'tester1', 'awd', '2025-05-14 11:37:01', 2),
(8, 'tester1', 'awda', '2025-05-14 12:00:07', 2),
(9, 'tester1', 'helelo', '2025-05-15 10:14:23', 1),
(10, 'Jens', 'I am aurtistic', '2025-05-15 10:14:27', 2),
(11, 'Jens', 'Brr Brr Patapim', '2025-05-15 10:19:43', 1),
(12, 'Jens', 'Tung Tung Tung Sahur', '2025-05-15 10:19:51', 1);

-- --------------------------------------------------------

--
-- Tabellstruktur `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(250) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumpning av Data i tabell `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`) VALUES
(1, 'tester1', '$2b$10$zHNctBgdKpBzGE9StNPNyeDGaRg9OOZ4jvZJ4HM1Uae0Lc4uFnmeW', 'hash@gmail.com'),
(3, 'tester2', '$2b$10$Zew4q6llOUqzl2SaxG0se.aC06Z.j9OU3W4Gkskn6ueW30Y3clTwa', 'hash@gmail.com'),
(4, 'ad', '$2b$10$UPCQ3oQqpmk/InFQpnK4v.mis7ig51ET8a3nfoCapBlihPGCdCQZG', 'awd@gamil'),
(5, 'awda', '$2b$10$62EFg/igp/NHkL6y1SgQE.VBS0a1ZB8j6acBTyLW1IdIOmZrQfGRm', 'ad@ad'),
(7, 'ada', '$2b$10$iIUTc/.vv.B6ycjLAr4fTOJlyTHExw9xCndX7Aldg8vORzfje3dVO', 'awa@ga'),
(8, 'test', '$2b$10$SPaqavD1g7SSL9BtdXTBtuclCPsgEpcQGeVcfXts2DGNTUkK.Y6PG', 'awa@ga'),
(9, 'testa', '$2b$10$gurkoUTB0zFc1cJ/23fax.Sc5ErlNOpn7fWpNXCX9zgci0nWUZ/m6', 'awa@ga'),
(10, 'testaa', '$2b$10$hH5ItsxGX22Cal/CwyNSpe3SAVFsQ9k7soY9YMrpfiHIf2FGhMNFm', 'awa@ga'),
(11, 'Tom', '$2b$10$InAHiIlcFh828hUFJnntIuIF6bUR9b.Y8iBHbWXSPIADNebySeODq', 'awdaw@gag'),
(12, 'Jens', '$2b$10$vy7gUOhI6XR35/Xld1Ou6eXZSmOuVLLMbhoS7QuVcTIovW8IQgTaG', 'Jens@a.a'),
(13, 'grogomado', '$2b$10$vu0BhjGyXvLffw64cn7kOOxe4.XSktaCKzgb.eNrhcJ/2cjkUeH3m', 'erik.forsum@skola.taby'),
(15, 'holros', '$2b$10$bsXUSG1cH/p1Z4uh6X/O2eHkXpjfJCTJjcM58XP4ANt4sxnLgoE9a', 'erik.forsum@skola.taby');

--
-- Index för dumpade tabeller
--

--
-- Index för tabell `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`);

--
-- Index för tabell `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT för tabell `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
