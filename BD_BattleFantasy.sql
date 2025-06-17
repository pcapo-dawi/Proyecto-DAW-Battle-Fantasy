-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         11.3.2-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.6.0.6765
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para battlefantasy
CREATE DATABASE IF NOT EXISTS `battlefantasy` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `battlefantasy`;

-- Volcando estructura para tabla battlefantasy.abilities
CREATE TABLE IF NOT EXISTS `abilities` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `UnlockLvl` int(11) DEFAULT NULL,
  `Damage` int(11) DEFAULT NULL,
  `Cooldown` int(11) DEFAULT NULL,
  `ID_Job` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_ability_job` (`ID_Job`),
  CONSTRAINT `fk_ability_job` FOREIGN KEY (`ID_Job`) REFERENCES `jobs` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla battlefantasy.abilities: ~30 rows (aproximadamente)
INSERT INTO `abilities` (`ID`, `Name`, `Description`, `UnlockLvl`, `Damage`, `Cooldown`, `ID_Job`) VALUES
	(1, 'Fire', 'Fire magic', 1, 25, 3, 1),
	(2, 'Blizzard', 'Ice magic', 5, 35, 5, 1),
	(3, 'Thunder', 'Lighting magic', 15, 50, 8, 1),
	(4, 'Greatsword', 'Nice sword', 1, 15, 3, 2),
	(5, 'Heavy sword', 'Is heavy', 5, 25, 3, 2),
	(6, 'Selene', 'Powerfull sword', 20, 40, 8, 2),
	(7, 'Shining finger', 'Domon', 1, 35, 5, 3),
	(8, 'The East is Burning Red', 'Kyoji', 10, 50, 8, 3),
	(9, 'Sekiha Tenkyoken', 'Kasshu', 30, 80, 15, 3),
	(10, 'Sacred sword', 'Pure', 1, 20, 3, 4),
	(11, 'Holly sword', 'Holly', 5, 30, 5, 4),
	(12, 'Caliburn', 'Ceremonial', 15, 45, 8, 4),
	(13, 'Judgement', 'Strong hit', 1, 20, 3, 5),
	(14, 'Spear Lore', 'Stronger hit', 5, 30, 5, 5),
	(15, 'Pierce', 'Even stronger hit', 15, 40, 8, 5),
	(16, 'Bulls eye', 'Hits on target with precission', 1, 15, 3, 6),
	(17, 'Quick shot', 'Quickly fire off a powerful shot at the target', 5, 25, 5, 6),
	(18, 'Deadly shot', 'Use your intense focus to fire a deadly shot at your enemy', 10, 40, 7, 6),
	(19, 'Pistol', 'Handgun', 1, 8, 2, 7),
	(20, 'Submachine', 'Gun', 3, 17, 4, 7),
	(21, 'Grenade', 'Launcher', 6, 26, 5, 7),
	(22, 'Darksword', 'Dark sword', 1, 30, 8, 8),
	(23, 'Edge slash', 'So edgy', 15, 40, 12, 8),
	(24, 'Dark edge', 'Dark edgy', 30, 60, 15, 8),
	(25, 'Goetia', 'Evil', 1, 30, 8, 9),
	(26, 'Notoria', 'Bad', 15, 40, 12, 9),
	(27, 'Dark rapture', 'Profane', 30, 65, 15, 9),
	(28, 'Gun-fu', 'Like kun-fu but with gun', 1, 35, 8, 10),
	(29, 'Blood Oath', 'Promissory', 15, 45, 12, 10),
	(30, 'Requiem of Vengeance', 'Gundam', 30, 70, 15, 10);

-- Volcando estructura para tabla battlefantasy.activemissions
CREATE TABLE IF NOT EXISTS `activemissions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `ID_Player` int(11) NOT NULL,
  `ID_Mission` int(11) NOT NULL,
  `EnemyHP` int(11) NOT NULL,
  `PlayerHP` int(11) NOT NULL,
  `EnemySuper` int(11) DEFAULT NULL,
  `PlayerDefinitivo` int(11) DEFAULT NULL,
  `Turn` int(11) NOT NULL,
  `AbilityCooldowns` text DEFAULT NULL,
  `EnemySuperAttack` int(11) DEFAULT NULL,
  `StartTime` datetime NOT NULL DEFAULT current_timestamp(),
  `LastUpdated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`ID`),
  KEY `ID_Player` (`ID_Player`),
  KEY `ID_Mission` (`ID_Mission`),
  CONSTRAINT `activemissions_ibfk_1` FOREIGN KEY (`ID_Player`) REFERENCES `players` (`ID`),
  CONSTRAINT `activemissions_ibfk_2` FOREIGN KEY (`ID_Mission`) REFERENCES `missions` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=334 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla battlefantasy.activemissions: ~0 rows (aproximadamente)

-- Volcando estructura para tabla battlefantasy.definitivo
CREATE TABLE IF NOT EXISTS `definitivo` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Damage` int(11) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla battlefantasy.definitivo: ~10 rows (aproximadamente)
INSERT INTO `definitivo` (`ID`, `Name`, `Damage`) VALUES
	(1, 'Nekoxplosion', 150),
	(2, 'Spartacus', 300),
	(3, 'Zenshin! Keiretsu! Tenpa kyoran!', 300),
	(4, 'Holy slash', 100),
	(5, 'Gae Bolg!', 230),
	(6, 'El Condor Pasa', 200),
	(7, 'Big Bang', 100),
	(8, 'Commedia', 340),
	(9, 'Divina', 330),
	(10, 'Parabellum', 240);

-- Volcando estructura para tabla battlefantasy.enemies
CREATE TABLE IF NOT EXISTS `enemies` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `HP` int(11) DEFAULT NULL,
  `Attack` int(11) DEFAULT NULL,
  `Defense` int(11) DEFAULT NULL,
  `Experience` int(11) DEFAULT NULL,
  `ID_SuperAttack` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_superattack` (`ID_SuperAttack`),
  CONSTRAINT `fk_superattack` FOREIGN KEY (`ID_SuperAttack`) REFERENCES `superattack` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla battlefantasy.enemies: ~3 rows (aproximadamente)
INSERT INTO `enemies` (`ID`, `Name`, `HP`, `Attack`, `Defense`, `Experience`, `ID_SuperAttack`) VALUES
	(1, 'Limosin', 150, 20, 1, 5, 1),
	(2, 'Knives', 200, 30, 1, 15, 2),
	(3, 'Wyndvern', 250, 60, 15, 100, 3);

-- Volcando estructura para tabla battlefantasy.jobaspects
CREATE TABLE IF NOT EXISTS `jobaspects` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Variant` enum('A','B') NOT NULL,
  `ID_Job` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `ID_Job` (`ID_Job`),
  CONSTRAINT `jobaspects_ibfk_1` FOREIGN KEY (`ID_Job`) REFERENCES `jobs` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla battlefantasy.jobaspects: ~19 rows (aproximadamente)
INSERT INTO `jobaspects` (`ID`, `Variant`, `ID_Job`) VALUES
	(1, 'A', 1),
	(2, 'B', 1),
	(3, 'A', 2),
	(4, 'B', 2),
	(5, 'A', 3),
	(6, 'B', 3),
	(7, 'A', 4),
	(8, 'B', 4),
	(9, 'A', 5),
	(10, 'B', 5),
	(11, 'A', 6),
	(12, 'B', 6),
	(13, 'A', 7),
	(14, 'B', 7),
	(15, 'A', 8),
	(16, 'B', 8),
	(17, 'A', 9),
	(18, 'B', 9),
	(19, 'A', 10),
	(20, 'B', 10);

-- Volcando estructura para tabla battlefantasy.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `BaseAttack` int(11) DEFAULT NULL,
  `BaseDefense` int(11) DEFAULT NULL,
  `ID_Definitivo` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_definitivo` (`ID_Definitivo`),
  CONSTRAINT `fk_definitivo` FOREIGN KEY (`ID_Definitivo`) REFERENCES `definitivo` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla battlefantasy.jobs: ~10 rows (aproximadamente)
INSERT INTO `jobs` (`ID`, `Name`, `Description`, `BaseAttack`, `BaseDefense`, `ID_Definitivo`) VALUES
	(1, 'Magician', 'Versed in a wide variety of magical arts.', 10, 5, 1),
	(2, 'Mercenary', 'Powerful warrior who works for the highest bidder.', 8, 10, 2),
	(3, 'Martial artist', 'His fists his best weapon', 10, 13, 3),
	(4, 'Holy knight', 'Sacred warrior fighting for the greater good', 11, 14, 4),
	(5, 'Valkyrie', 'Legendary spear-wielding warrior', 9, 14, 5),
	(6, 'Archer', 'The Archer class really is made up of archers', 7, 5, 6),
	(7, 'Soldier', 'Has a gun', 1, 1, 7),
	(8, 'Edgelord', 'Dark warrior', 13, 10, 8),
	(9, 'Dark angel', 'Pure evil', 14, 10, 9),
	(10, 'Baba yaga', 'Vengeance', 20, 10, 10);

-- Volcando estructura para tabla battlefantasy.missions
CREATE TABLE IF NOT EXISTS `missions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Time` int(11) DEFAULT NULL,
  `Reward` int(11) DEFAULT NULL,
  `ID_Enemy` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `ID_Enemy` (`ID_Enemy`),
  CONSTRAINT `fk_mission_enemy` FOREIGN KEY (`ID_Enemy`) REFERENCES `enemies` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla battlefantasy.missions: ~3 rows (aproximadamente)
INSERT INTO `missions` (`ID`, `Name`, `Description`, `Time`, `Reward`, `ID_Enemy`) VALUES
	(1, 'Sticky fingers', 'A plump Limosin is endangering the city, please eliminate it.', 60, 10, 1),
	(2, 'Army knife', 'A rare beast with blades on its body is terrorizing the village.', 60, 50, 2),
	(3, 'Less than a dragon', 'Wyvern , a pitiful, but strong beast.', 60, 100, 3);

-- Volcando estructura para tabla battlefantasy.players
CREATE TABLE IF NOT EXISTS `players` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Password` varchar(100) DEFAULT NULL,
  `HP` int(11) DEFAULT NULL,
  `Attack` int(11) DEFAULT NULL,
  `Defense` int(11) DEFAULT NULL,
  `Experience` int(11) DEFAULT NULL,
  `Level` int(11) DEFAULT NULL,
  `ID_Job` int(11) DEFAULT NULL,
  `ID_UniqueAbility` int(11) DEFAULT NULL,
  `ID_Mission` int(11) DEFAULT NULL,
  `ID_JobAspect` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Email` (`Email`),
  KEY `fk_player_job` (`ID_Job`),
  KEY `fk_player_unique` (`ID_UniqueAbility`),
  KEY `fk_player_mission` (`ID_Mission`),
  KEY `fk_player_aspect` (`ID_JobAspect`),
  CONSTRAINT `fk_player_aspect` FOREIGN KEY (`ID_JobAspect`) REFERENCES `jobaspects` (`ID`),
  CONSTRAINT `fk_player_job` FOREIGN KEY (`ID_Job`) REFERENCES `jobs` (`ID`),
  CONSTRAINT `fk_player_mission` FOREIGN KEY (`ID_Mission`) REFERENCES `missions` (`ID`),
  CONSTRAINT `fk_player_unique` FOREIGN KEY (`ID_UniqueAbility`) REFERENCES `uniqueabilities` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando estructura para tabla battlefantasy.superattack
CREATE TABLE IF NOT EXISTS `superattack` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Damage` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla battlefantasy.superattack: ~0 rows (aproximadamente)
INSERT INTO `superattack` (`ID`, `Name`, `Damage`) VALUES
	(1, 'LimoKill', 10),
	(2, 'MillionKnives', 50),
	(3, 'Wyndtofetido', 150);

-- Volcando estructura para tabla battlefantasy.uniqueabilities
CREATE TABLE IF NOT EXISTS `uniqueabilities` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Damage` int(11) DEFAULT NULL,
  `Cooldown` int(11) DEFAULT NULL,
  `ID_Job` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `fk_unique_job` (`ID_Job`),
  CONSTRAINT `fk_unique_job` FOREIGN KEY (`ID_Job`) REFERENCES `jobs` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla battlefantasy.uniqueabilities: ~30 rows (aproximadamente)
INSERT INTO `uniqueabilities` (`ID`, `Name`, `Description`, `Damage`, `Cooldown`, `ID_Job`) VALUES
	(1, 'Agi', 'Powerfull fire magic', 35, 7, 1),
	(2, 'Bufu', 'Powerfull ice magic', 50, 9, 1),
	(3, 'Zio', 'Powerfull lighting magic', 55, 10, 1),
	(4, 'Blade Rush', 'Speed and steel', 25, 7, 2),
	(5, 'Crushing Blow', 'One hit to break bones', 40, 8, 2),
	(6, 'Warcry Slash', '"Fear is just the beginning', 45, 8, 2),
	(7, 'Choukyuu Haou Den eidan', 'Shuffle', 60, 10, 3),
	(8, 'God Finger', 'concentrates energy', 55, 10, 3),
	(9, 'Soten Ranka', 'A powerful attack ', 40, 8, 3),
	(10, 'Excalibur', 'Saber', 60, 10, 4),
	(11, 'Balmung', 'Sigfried', 50, 8, 4),
	(12, 'Kusanagi', 'no Tsurugi', 55, 9, 4),
	(13, 'Pinchito', 'Te pincha', 50, 9, 5),
	(14, 'Gungnir', 'Alfadore', 60, 10, 5),
	(15, 'Brahmaastra', 'Mahabharata', 55, 9, 5),
	(16, 'Unlimited Blade Works', 'Still Archer', 70, 10, 6),
	(17, 'Gate of Babylon', 'Throw things', 100, 15, 6),
	(18, 'Stella', 'Lone Meteor', 999, 99, 6),
	(19, 'Handgun', 'Pistol', 5, 1, 7),
	(20, 'Machunegun', 'Slot', 5, 2, 7),
	(21, 'Doble gun', 'Two hand gun', 10, 1, 7),
	(22, 'Shadow Sever', 'From the abyss, I cut what light remains', 55, 8, 8),
	(23, 'Dusk Reaping', 'Pain is clarity. Let me show you truth.', 50, 8, 8),
	(24, ' Veil of Sorrow', 'They can’t strike what’s already lost to the night', 60, 10, 8),
	(25, 'Asmodeus', 'Spirit of revenge', 60, 9, 9),
	(26, 'Vassago', 'Mighty prince of good nature', 50, 9, 9),
	(27, 'Lemegeton', 'Clavicula Salomonis', 70, 10, 9),
	(28, 'Continental Clean-Up', 'Every contract ends the same way', 55, 8, 10),
	(29, 'Consequences Overdue', 'Rules Consequences', 70, 10, 10),
	(30, 'Last Word', 'No more chances. No more words.', 65, 9, 10);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
