import type {Page} from '@playwright/test'
import {expect, Locator} from '@playwright/test'
import {EmployeesPage} from "./EmployeesPage";

export class HomePage {
    readonly page: Page
    readonly dashboardSideBarMenuButton: Locator
    readonly employeesSideBarMenuButton: Locator


    constructor(page: Page) {
        this.page = page
        this.dashboardSideBarMenuButton = page.getByTestId('dashboard')
        this.employeesSideBarMenuButton = page.getByTestId('employees')
    }

    async navigateToDashboard(): Promise<void> {
        await this.page.goto('/')
        await expect(this.dashboardSideBarMenuButton).toBeVisible()
        await expect(this.dashboardSideBarMenuButton).toBeEnabled()
        await this.dashboardSideBarMenuButton.click()
        await expect(this.page).toHaveURL('/dashboard')
    }

    async navigateToEmployees(): Promise<void> {
        await this.page.goto('/')
        const employeesPage = new EmployeesPage(this.page);
        await expect(this.employeesSideBarMenuButton).toBeVisible()
        await expect(this.employeesSideBarMenuButton).toBeEnabled()
        await this.employeesSideBarMenuButton.click()
        await expect(this.page).toHaveURL('/employee-hub')
        await expect(employeesPage.addEmployeeButton).toBeVisible()
    }
}
