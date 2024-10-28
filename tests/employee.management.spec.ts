import test from '../utils/Pages'
import {Employee} from "../utils/employees/Employee";

test.describe( 'Tests with user 1 auth', () => {
  test.use({ storageState: (process.env.CI ? process.env.CI_PROJECT_DIR + '/playwright/' : '') + 'tests/.auth/user_1.json' });
  test('Testing adding and verifying employees: ', async ({ homePage, employeesPage

                                                                                           }) => {

    const testId = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const employee_1 = {
      firstName: "Vincent",
      lastName: `Vega-${testId(100, 300)}`,
      email: "vincent@burger.com",
      registrationEmail: true,
      phoneNumber: "0395723985",
      startDate: `${new Date().getDate()}`,
      jobTitle: "CEO"
    } as Employee;

    const employee_2 = {
      firstName: "Mia",
      lastName: `Wallace-${testId(301, 500)}`,
      email: "mia333@footcare.com",
      registrationEmail: false,
      jobTitle: "Customer Support"
    } as Employee;

    let employee2Id


    await test.step(`Navigating to Employees page`, async () => {
      await homePage.navigateToEmployees()
    })

    await test.step(`Adding employee 1,  ${employee_1.firstName} `, async () => {
      await employeesPage.openAddEmployeeForm()
      await employeesPage.fillOutEmployeeForm(employee_1)
      await employeesPage.saveEmployee()
    })

    await test.step(`Closing popup and adding employee 2,  ${employee_2.firstName} `, async () => {
      await employeesPage.closeEmployeeSuccessPopup()
      await homePage.navigateToEmployees()
      await employeesPage.openAddEmployeeForm()
      await employeesPage.fillOutEmployeeForm(employee_2)
      employee2Id = await employeesPage.saveEmployee()

    })

    await test.step(`Searching for Employee 1 to verify they are saved `, async () => {
      await employeesPage.closeEmployeeSuccessPopup()
      await homePage.navigateToEmployees()
      await employeesPage.verifyEmployeeIsSavedWithSearch(employee_1)
    })

    await test.step(`Verifying Employee 2 is displayed on the Employees Page `, async () => {
      await employeesPage.verifyEmployeeIsSavedOnPage(employee2Id)
    })
    // ideally if more time available would be to add "teardown" hook with deletion of created users
  });

});