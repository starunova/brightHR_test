import { test as baseTest } from '@playwright/test'
import { HomePage } from '../pages/HomePage'
import { EmployeesPage } from  '../pages/EmployeesPage'


const test = baseTest.extend<{
    homePage: HomePage
    employeesPage: EmployeesPage

}>({

    homePage: async ({ page }, use) => {
        await use(new HomePage(page))
    },
    employeesPage: async ({ page }, use) => {
        await use(new EmployeesPage(page))
    }
});

export default test
