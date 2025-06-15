-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 15, 2025 at 03:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cafe_de_jur`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `accountID` int(11) NOT NULL,
  `firstname` text NOT NULL,
  `lastname` text NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  `address` varchar(200) DEFAULT NULL,
  `phoneNum` varchar(50) DEFAULT NULL,
  `userRole` enum('Admin','Customer') NOT NULL,
  `accStatus` enum('Pending','Registered') NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`accountID`, `firstname`, `lastname`, `email`, `password`, `address`, `phoneNum`, `userRole`, `accStatus`) VALUES
(22, 'Gerlyn', 'Tan', 'gerlyntan07@gmail.com', '$2b$10$HatDnhYdQMAqSbxKe7aO3ORBXofox/2jEq1HS59phOXIEqE1HYfwq', NULL, '+639910328158', 'Customer', 'Registered'),
(24, 'Admin', 'Account', 'admin@gmail.com', '$2b$10$XoH2ecvulLczlsnYLiEAweZiOUpZPftoTrrqcS8ehEEYkTYHvcdGa', NULL, '+6391232132131', 'Admin', 'Registered');

-- --------------------------------------------------------

--
-- Table structure for table `addon`
--

CREATE TABLE `addon` (
  `addOnID` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` enum('Beverage','Pasta','Silog','Croffle') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `addon`
--

INSERT INTO `addon` (`addOnID`, `name`, `price`, `category`) VALUES
(1, 'Almond Nuts', 15.00, 'Croffle'),
(2, 'Crushed Oreos', 15.00, 'Croffle'),
(3, 'Biscoff Spread', 30.00, 'Croffle'),
(4, 'Nutella Spread', 30.00, 'Croffle'),
(5, 'Banana', 15.00, 'Croffle'),
(6, 'Whipped Cream', 30.00, 'Croffle'),
(7, 'Extra Bread', 10.00, 'Pasta'),
(8, 'Extra Sauce', 20.00, 'Pasta'),
(9, 'Extra Rice', 25.00, 'Silog'),
(10, 'Extra Egg', 15.00, 'Silog'),
(11, 'Extra Cheese Sauce', 10.00, 'Silog'),
(12, 'Espresso Shot (single)', 20.00, 'Beverage'),
(13, 'Caramel Drizzle', 25.00, 'Beverage'),
(14, 'Chocolate Drizzle', 25.00, 'Beverage'),
(15, 'Cream Cheese Foam', 25.00, 'Beverage'),
(16, 'Flavored Syrup', 25.00, 'Beverage'),
(17, 'Whipped Cream', 25.00, 'Beverage'),
(18, 'Crushed Oreo', 20.00, 'Beverage'),
(19, 'Extra Coffee Jelly', 20.00, 'Beverage'),
(20, 'Banana Pudding', 45.00, 'Beverage'),
(21, 'Sub-Oat Milk', 45.00, 'Beverage');

-- --------------------------------------------------------

--
-- Table structure for table `beverage_variant`
--

CREATE TABLE `beverage_variant` (
  `variantID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `size` enum('16oz','22oz','Hot','Regular','Large') NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `beverage_variant`
--

INSERT INTO `beverage_variant` (`variantID`, `productID`, `size`, `price`) VALUES
(1, 20, '16oz', 89.00),
(2, 20, '22oz', 109.00),
(3, 22, '16oz', 99.00),
(4, 22, '22oz', 109.00),
(5, 22, 'Hot', 99.00),
(6, 23, '16oz', 129.00),
(7, 23, '22oz', 149.00),
(8, 24, '16oz', 109.00),
(9, 24, '22oz', 129.00),
(10, 24, 'Hot', 99.00),
(11, 25, '16oz', 89.00),
(12, 25, '22oz', 109.00),
(13, 26, '16oz', 119.00),
(14, 26, '22oz', 139.00),
(15, 26, 'Hot', 109.00),
(16, 27, 'Hot', 79.00),
(17, 28, '16oz', 109.00),
(18, 28, '22oz', 129.00),
(19, 28, 'Hot', 99.00),
(20, 29, '16oz', 129.00),
(21, 29, '22oz', 149.00),
(22, 29, 'Hot', 119.00),
(23, 30, '16oz', 109.00),
(24, 30, '22oz', 129.00),
(25, 30, 'Hot', 99.00),
(26, 31, '16oz', 79.00),
(27, 31, '22oz', 89.00),
(28, 32, '16oz', 59.00),
(29, 32, '22oz', 79.00),
(30, 32, 'Hot', 59.00),
(31, 33, '16oz', 129.00),
(32, 33, '22oz', 149.00),
(33, 33, 'Hot', 119.00),
(34, 34, '16oz', 89.00),
(35, 34, '22oz', 109.00),
(36, 35, 'Regular', 79.00),
(37, 35, 'Large', 99.00);

-- --------------------------------------------------------

--
-- Table structure for table `cart_item`
--

CREATE TABLE `cart_item` (
  `cartItemID` int(11) NOT NULL,
  `accountID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `variantID` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `totalPrice` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_item`
--

INSERT INTO `cart_item` (`cartItemID`, `accountID`, `productID`, `variantID`, `quantity`, `totalPrice`) VALUES
(3, 22, 32, 29, 1, 119.00),
(4, 22, 7, NULL, 2, 215.00),
(5, 22, 10, NULL, 2, 190.00);

-- --------------------------------------------------------

--
-- Table structure for table `cart_item_addon`
--

CREATE TABLE `cart_item_addon` (
  `cartAddOnID` int(11) NOT NULL,
  `cartItemID` int(11) NOT NULL,
  `addOnID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_item_addon`
--

INSERT INTO `cart_item_addon` (`cartAddOnID`, `cartItemID`, `addOnID`) VALUES
(2, 3, 12),
(3, 3, 19),
(4, 4, 1),
(5, 5, 11);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `productID` int(11) NOT NULL,
  `productName` varchar(100) NOT NULL,
  `productImgURL` varchar(2083) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `category` enum('Beverage','Croffle','Pasta','Silog') NOT NULL,
  `drinkType` enum('Coffee','Non-Coffee','Fruity Fritz') DEFAULT NULL,
  `totalSold` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productID`, `productName`, `productImgURL`, `description`, `price`, `category`, `drinkType`, `totalSold`) VALUES
(2, 'Alcapone Caramel', 'https://ik.imagekit.io/cafedejur/menu/alcapone%20caramel.jpg?updatedAt=1749378249502', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 115.00, 'Croffle', NULL, NULL),
(3, 'Biscoff Cream', 'https://ik.imagekit.io/cafedejur/menu/biscoff%20cream.jpg?updatedAt=1749378249394', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 120.00, 'Croffle', NULL, NULL),
(4, 'Alcapone Biscoff', 'https://ik.imagekit.io/cafedejur/menu/alcapone%20biscoff.jpg?updatedAt=1749378249221', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 130.00, 'Croffle', NULL, NULL),
(5, 'Oreo Cream', 'https://ik.imagekit.io/cafedejur/menu/oreo%20cream.jpg?updatedAt=1749378257084', 'ewqewqesadsad kashdkj jashdjhasd ash asjhd asd asdasda asd asd sadsaaa ewrwer df hr s gkjh hjkhjkh kjhjkfhdjksh jhdjk hdjks hkjdshfk ', 110.00, 'Croffle', NULL, NULL),
(6, 'Nutella Smores', 'https://ik.imagekit.io/cafedejur/menu/nutella%20smores.jpg?updatedAt=1749378256333', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 120.00, 'Croffle', NULL, NULL),
(7, 'Biscoff Spread', 'https://ik.imagekit.io/cafedejur/menu/biscoff%20spread.jpeg?updatedAt=1749378250524', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 100.00, 'Croffle', NULL, NULL),
(8, 'Classic Croffle', 'https://ik.imagekit.io/cafedejur/menu/classic.jpg?updatedAt=1749378254954', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 70.00, 'Croffle', NULL, NULL),
(9, 'Bananuttela', 'https://ik.imagekit.io/cafedejur/menu/bananutella.jpg?updatedAt=1749378249153', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 105.00, 'Croffle', NULL, NULL),
(10, 'Longganisa Silog', 'https://ik.imagekit.io/cafedejur/menu/longsilog.png?updatedAt=1749378257040', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 95.00, 'Silog', NULL, NULL),
(11, 'Maling Silog', 'https://ik.imagekit.io/cafedejur/menu/maling%20silog.png?updatedAt=1749378257038', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 90.00, 'Silog', NULL, NULL),
(12, 'Meatball Silog', 'https://ik.imagekit.io/cafedejur/menu/meatball%20silog.png?updatedAt=1749378256042', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 110.00, 'Silog', NULL, NULL),
(13, 'Hotdog Silog', 'https://ik.imagekit.io/cafedejur/menu/hotsilog.png?updatedAt=1749378255153', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 90.00, 'Silog', NULL, NULL),
(14, 'Chicken Sisig Silog', 'https://ik.imagekit.io/cafedejur/menu/Chiken%20sisig%20silog.jpg?updatedAt=1749378249219', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 110.00, 'Silog', NULL, NULL),
(15, 'Pinoy Style Spaghetti', 'https://ik.imagekit.io/cafedejur/menu/Pinoy-style%20spaghetti.jpg?updatedAt=1749378260713', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 110.00, 'Pasta', NULL, NULL),
(16, 'Tuna Pasta', 'https://ik.imagekit.io/cafedejur/menu/Tuna%20pasta.jpg?updatedAt=1749378260352', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 90.00, 'Pasta', NULL, NULL),
(17, 'Meatballs Spaghetti', 'https://ik.imagekit.io/cafedejur/menu/meatball%20spaghetti.jpg?updatedAt=1749378256171', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 130.00, 'Pasta', NULL, NULL),
(18, 'Carbonara', 'https://ik.imagekit.io/cafedejur/menu/carbonara.jpg?updatedAt=1749378249434', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 100.00, 'Pasta', NULL, NULL),
(19, 'Charlie Chan', 'https://ik.imagekit.io/cafedejur/menu/charlie%20chan.jpg?updatedAt=1749378249136', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 130.00, 'Pasta', NULL, NULL),
(20, 'Orange Americano', 'https://ik.imagekit.io/cafedejur/menu/Orange%20Americano.jpg?updatedAt=1749378256883', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Coffee', NULL),
(22, 'Spanish Latte', 'https://ik.imagekit.io/cafedejur/menu/Iced%20Spanish%20Latte.jpg?updatedAt=1749378255646', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Coffee', NULL),
(23, 'Strawberry Espresso', 'https://ik.imagekit.io/cafedejur/menu/strawberry%20Espresso.jpg?updatedAt=1749559496578', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Coffee', NULL),
(24, 'Caramel Latte', 'https://ik.imagekit.io/cafedejur/menu/caramel%20latte.png?updatedAt=1749559493510', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Coffee', NULL),
(25, 'Iced Coffee Vanilla', 'https://ik.imagekit.io/cafedejur/menu/iced%20coffee%20vanilla.png?updatedAt=1749559493479', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Coffee', NULL),
(26, 'Caramel Macchiato', 'https://ik.imagekit.io/cafedejur/menu/caramel%20macchiato.png?updatedAt=1749559493350', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Coffee', NULL),
(27, 'Cappuccino', 'https://ik.imagekit.io/cafedejur/menu/cappuccino.png?updatedAt=1749559493122', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Coffee', NULL),
(28, 'Dark Mocha', 'https://ik.imagekit.io/cafedejur/menu/dark%20mocha.png?updatedAt=1749559493115', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Coffee', NULL),
(29, 'Biscoff Latte', 'https://ik.imagekit.io/cafedejur/menu/Biscoff%20latte.png?updatedAt=1749559493081', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Coffee', NULL),
(30, 'White Caramel', 'https://ik.imagekit.io/cafedejur/menu/white%20caramel%20latte.png?updatedAt=1749559493084', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Coffee', NULL),
(31, 'Iced Coffee Original', 'https://ik.imagekit.io/cafedejur/menu/iced%20coffee%20original.jpg?updatedAt=1749559492409', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Coffee', NULL),
(32, 'Americano', 'https://ik.imagekit.io/cafedejur/menu/americano.jpg?updatedAt=1749559492179', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Coffee', NULL),
(33, 'Matcha Espresso', 'https://ik.imagekit.io/cafedejur/menu/matcha%20espresso.jpg?updatedAt=1749559492145', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Coffee', NULL),
(34, 'Matcha Latte', 'https://ik.imagekit.io/cafedejur/menu/matcha%20latte.png?updatedAt=1749562698387', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Non-Coffee', NULL),
(35, 'Strawberry', 'https://ik.imagekit.io/cafedejur/menu/Strawberry%20Fruity%20Fritz%20.png?updatedAt=1749562698255', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', NULL, 'Beverage', 'Fruity Fritz', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('9Mr9tO2vPxSM_6YoCdP3X1VzwsOhS1Vm', 1750079732, '{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-06-16T12:10:32.101Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"accountID\":22,\"email\":\"gerlyntan07@gmail.com\",\"userRole\":\"Customer\",\"firstname\":\"Gerlyn\",\"lastname\":\"Tan\"}');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`accountID`);

--
-- Indexes for table `addon`
--
ALTER TABLE `addon`
  ADD PRIMARY KEY (`addOnID`);

--
-- Indexes for table `beverage_variant`
--
ALTER TABLE `beverage_variant`
  ADD PRIMARY KEY (`variantID`),
  ADD KEY `productID` (`productID`);

--
-- Indexes for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD PRIMARY KEY (`cartItemID`),
  ADD KEY `accountID` (`accountID`),
  ADD KEY `productID` (`productID`),
  ADD KEY `variantID` (`variantID`);

--
-- Indexes for table `cart_item_addon`
--
ALTER TABLE `cart_item_addon`
  ADD PRIMARY KEY (`cartAddOnID`),
  ADD KEY `cartItemID` (`cartItemID`),
  ADD KEY `addOnID` (`addOnID`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`productID`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `account`
--
ALTER TABLE `account`
  MODIFY `accountID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `addon`
--
ALTER TABLE `addon`
  MODIFY `addOnID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `beverage_variant`
--
ALTER TABLE `beverage_variant`
  MODIFY `variantID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `cart_item`
--
ALTER TABLE `cart_item`
  MODIFY `cartItemID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cart_item_addon`
--
ALTER TABLE `cart_item_addon`
  MODIFY `cartAddOnID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `productID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `beverage_variant`
--
ALTER TABLE `beverage_variant`
  ADD CONSTRAINT `beverage_variant_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD CONSTRAINT `cart_item_ibfk_1` FOREIGN KEY (`accountID`) REFERENCES `account` (`accountID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cart_item_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`),
  ADD CONSTRAINT `cart_item_ibfk_3` FOREIGN KEY (`variantID`) REFERENCES `beverage_variant` (`variantID`);

--
-- Constraints for table `cart_item_addon`
--
ALTER TABLE `cart_item_addon`
  ADD CONSTRAINT `cart_item_addon_ibfk_1` FOREIGN KEY (`cartItemID`) REFERENCES `cart_item` (`cartItemID`),
  ADD CONSTRAINT `cart_item_addon_ibfk_2` FOREIGN KEY (`addOnID`) REFERENCES `addon` (`addOnID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
