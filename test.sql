
-- -----------------------------------------------------
-- Table `sql11684406`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sql11684406`.`category` (
  `name` VARCHAR(20) NOT NULL,
  `id` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sql11684406`.`employee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sql11684406`.`employee` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `National_id` VARCHAR(45) NOT NULL,
  `Fname` VARCHAR(45) NOT NULL,
  `Lname` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(200) NOT NULL,
  `Phone_number` VARCHAR(45) NOT NULL,
  `Personal_image` VARCHAR(45) NOT NULL,
  `country` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `Address` VARCHAR(45) NOT NULL,
  `user_name` VARCHAR(45) NOT NULL,
  `verified` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  UNIQUE INDEX `National_id_UNIQUE` (`National_id` ASC) ,
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC) ,
  UNIQUE INDEX `user_name_UNIQUE` (`user_name` ASC) )
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sql11684406`.`EmployeeHasCategory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sql11684406`.`EmployeeHasCategory` (
  `employee_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  PRIMARY KEY (`employee_id`, `category_id`),
  INDEX `fk_employee_has_category_category1_idx` (`category_id` ASC) ,
  INDEX `fk_employee_has_category_employee1_idx` (`employee_id` ASC) ,
  CONSTRAINT `fk_employee_has_category_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `sql11684406`.`category` (`id`),
  CONSTRAINT `fk_employee_has_category_employee1`
    FOREIGN KEY (`employee_id`)
    REFERENCES `sql11684406`.`employee` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sql11684406`.`Employer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sql11684406`.`Employer` (
  `emp_id` INT NOT NULL AUTO_INCREMENT,
  `Fname` VARCHAR(45) NOT NULL,
  `Lname` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(45) NOT NULL,
  `Password` VARCHAR(200) NOT NULL,
  `Phone_number` VARCHAR(45) NOT NULL,
  `img` VARCHAR(191) NOT NULL,
  `country` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `Address` VARCHAR(60) NOT NULL,
  `user_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`emp_id`),
  UNIQUE INDEX `emp_id_UNIQUE` (`emp_id` ASC) ,
  UNIQUE INDEX `Email_UNIQUE` (`Email` ASC) ,
  UNIQUE INDEX `user_name_UNIQUE` (`user_name` ASC) )
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sql11684406`.`Links`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sql11684406`.`Links` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Linkedin` VARCHAR(45) NULL DEFAULT NULL,
  `Github` VARCHAR(45) NULL DEFAULT NULL,
  `other` VARCHAR(45) NULL DEFAULT NULL,
  `employee_id` INT NOT NULL,
  PRIMARY KEY (`id`, `employee_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_Links_employee1_idx` (`employee_id` ASC) ,
  CONSTRAINT `fk_Links_employee1`
    FOREIGN KEY (`employee_id`)
    REFERENCES `sql11684406`.`employee` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sql11684406`.`Payments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sql11684406`.`Payments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `status` INT NOT NULL,
  `Total_amount` INT NOT NULL,
  `date` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sql11684406`.`reviews`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sql11684406`.`reviews` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `text` VARCHAR(200) NOT NULL,
  `img` LONGBLOB NULL DEFAULT NULL,
  `rating` DECIMAL(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sql11684406`.`Tasks`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sql11684406`.`Tasks` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Title` VARCHAR(45) NOT NULL,
  `Descr` VARCHAR(200) NOT NULL,
  `status` VARCHAR(45) NOT NULL,
  `posting_date` DATETIME NOT NULL,
  `deadline` DATETIME NOT NULL,
  `Address` VARCHAR(45) NOT NULL,
  `price` DECIMAL(10,0) NULL DEFAULT NULL,
  `img` LONGBLOB NULL DEFAULT NULL,
  `note` VARCHAR(100) NULL DEFAULT NULL,
  `Employer_emp_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  `Payments_id` INT NOT NULL,
  `reviews_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Employer_emp_id`, `category_id`, `Payments_id`, `reviews_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_Tasks_Employer1_idx` (`Employer_emp_id` ASC) ,
  INDEX `fk_Tasks_Payments1_idx` (`Payments_id` ASC) ,
  INDEX `fk_Tasks_category1_idx` (`category_id` ASC) ,
  INDEX `fk_Tasks_reviews1_idx` (`reviews_id` ASC) ,
  CONSTRAINT `fk_Tasks_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `sql11684406`.`category` (`id`),
  CONSTRAINT `fk_Tasks_Employer1`
    FOREIGN KEY (`Employer_emp_id`)
    REFERENCES `sql11684406`.`Employer` (`emp_id`),
  CONSTRAINT `fk_Tasks_Payments1`
    FOREIGN KEY (`Payments_id`)
    REFERENCES `sql11684406`.`Payments` (`id`),
  CONSTRAINT `fk_Tasks_reviews1`
    FOREIGN KEY (`reviews_id`)
    REFERENCES `sql11684406`.`reviews` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sql11684406`.`Tasks_has_employee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sql11684406`.`Tasks_has_employee` (
  `Tasks_id` INT NOT NULL,
  `employee_id` INT NOT NULL,
  PRIMARY KEY (`Tasks_id`, `employee_id`),
  UNIQUE INDEX `Tasks_id_UNIQUE` (`Tasks_id` ASC) ,
  UNIQUE INDEX `employee_id_UNIQUE` (`employee_id` ASC) ,
  INDEX `fk_Tasks_has_employee_Tasks_idx` (`Tasks_id` ASC) ,
  INDEX `fk_Tasks_has_employee_employee1_idx` (`employee_id` ASC) ,
  CONSTRAINT `fk_Tasks_has_employee_employee1`
    FOREIGN KEY (`employee_id`)
    REFERENCES `sql11684406`.`employee` (`id`),
  CONSTRAINT `fk_Tasks_has_employee_Tasks`
    FOREIGN KEY (`Tasks_id`)
    REFERENCES `sql11684406`.`Tasks` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sql11684406`.`certficates`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sql11684406`.`certficates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `employee_id` INT NOT NULL,
  PRIMARY KEY (`id`, `employee_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_certficates_employee1_idx` (`employee_id` ASC) ,
  CONSTRAINT `fk_certficates_employee1`
    FOREIGN KEY (`employee_id`)
    REFERENCES `sql11684406`.`employee` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sql11684406`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sql11684406`.`messages` (
  `id` INT NOT NULL,
  `text` VARCHAR(1000) NOT NULL,
  `img` LONGBLOB NULL DEFAULT NULL,
  `Date` DATETIME NOT NULL,
  `employee_id` INT NOT NULL,
  `Employer_emp_id` INT NOT NULL,
  PRIMARY KEY (`id`, `employee_id`, `Employer_emp_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_messages_Employer1_idx` (`Employer_emp_id` ASC) ,
  INDEX `fk_messages_employee1_idx` (`employee_id` ASC) ,
  CONSTRAINT `fk_messages_employee1`
    FOREIGN KEY (`employee_id`)
    REFERENCES `sql11684406`.`employee` (`id`),
  CONSTRAINT `fk_messages_Employer1`
    FOREIGN KEY (`Employer_emp_id`)
    REFERENCES `sql11684406`.`Employer` (`emp_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `sql11684406`.`problems`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sql11684406`.`problems` (
  `id` INT NOT NULL,
  `text` VARCHAR(45) NOT NULL,
  `img` LONGBLOB NOT NULL,
  `Employer_emp_id` INT NOT NULL,
  `employee_id` INT NOT NULL,
  PRIMARY KEY (`id`, `Employer_emp_id`, `employee_id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) ,
  INDEX `fk_problems_Employer1_idx` (`Employer_emp_id` ASC) ,
  INDEX `fk_problems_employee1_idx` (`employee_id` ASC) ,
  CONSTRAINT `fk_problems_employee1`
    FOREIGN KEY (`employee_id`)
    REFERENCES `sql11684406`.`employee` (`id`),
  CONSTRAINT `fk_problems_Employer1`
    FOREIGN KEY (`Employer_emp_id`)
    REFERENCES `sql11684406`.`Employer` (`emp_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;