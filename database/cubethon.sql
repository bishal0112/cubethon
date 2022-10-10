-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2021 at 10:43 AM
-- Server version: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cubethon`
--

-- --------------------------------------------------------
-- Create Table users
CREATE TABLE `cubethon`.`users` (`id` INT(10) NOT NULL AUTO_INCREMENT , `username` VARCHAR(100) NOT NULL , `password` VARCHAR(100) NOT NULL , `email` VARCHAR(100) NULL DEFAULT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
--
--
-- Insert into users table
--
--
INSERT INTO `users`(`id`, `username`, `password`, `email`) VALUES 
('1','bishal','12345','bishal@gmail.com'),
('2','dheeraj','12345','dheeraj@gmail.com'),
('3','vishwas','12345','vishwas@gmail.com');


-- Create Table admin
CREATE TABLE 'cubethon'.'admin' ('id' INT(10) NOT NULL AUTO_INCREMENT , 'username' VARCHAR(100) NOT NULL, 'password' VARCHAR(100) NOT NULL, 'email' VARCHAR(100) NULL DEFAULT NULL, 'phone' VARCHAR(10) NOT NULL, 'address' VARCHAR(200) NOT NULL, PRIMARY KEY ('id'))  ENGINE = InnoDB;

--
--
-- Insert into admin table
--
--
INSERT INTO `admin`(`id`, `username`, `password`, `email`, `phone`, `address`) VALUES ('1','admin','admin','admin@gmail.com','8618956966','Bangalore, India')