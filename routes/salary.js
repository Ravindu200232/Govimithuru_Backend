const express = require('express');
const router = express.Router();
const Employee = require('../models/employeeshowcase');
const Salary = require('../models/Salary');

// Add or Update Salary
router.post('/add', async (req, res) => {
  const { employeeId, basicSalary, bonus, ETF, payday } = req.body;

  try {
    // Find the employee by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).send('Employee not found');
    }

    // Calculate the total salary
    const totalSalary = basicSalary + bonus + ETF;

    // Find existing salary record
    let existingSalary = await Salary.findOne({ employeeId });
    if (existingSalary) {
      // Update existing salary record
      existingSalary.basicSalary = basicSalary;
      existingSalary.bonus = bonus;
      existingSalary.ETF = ETF;
      existingSalary.totalSalary = totalSalary;
      existingSalary.payday = new Date(payday); // Update payday

      await existingSalary.save();
      return res.status(200).send('Salary record updated successfully');
    } else {
      // Create a new salary record
      const newSalary = new Salary({
        employeeId,
        name: `${employee.firstName} ${employee.lastName}`,
        position: employee.position,
        basicSalary,
        bonus,
        ETF,
        totalSalary,
        payday: new Date(payday) // Save the payday
      });

      await newSalary.save();
      return res.status(201).send('Salary record added successfully');
    }
  } catch (err) {
    res.status(500).send('Error adding or updating salary record');
  }
});

// Get all salaries
router.get('/', async (req, res) => {
  try {
    const salaries = await Salary.find().populate('employeeId');
    res.json(salaries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching salaries' });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSalary = await Salary.findByIdAndDelete(id);
    if (!deletedSalary) {
      return res.status(404).send('Salary record not found');
    }
    res.status(200).send('Salary record deleted successfully');
  } catch (err) {
    res.status(500).send('Error deleting salary record');
  }
});

module.exports = router;
