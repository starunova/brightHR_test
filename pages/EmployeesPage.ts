import type {Page} from '@playwright/test'
import {expect, Locator} from '@playwright/test'
import {Employee} from "../utils/employees/Employee";

export class EmployeesPage {
    readonly page: Page
    readonly addEmployeeButton: Locator
    readonly employeeSearchInput: Locator
    readonly firstNameInput: Locator
    readonly lastNameInput: Locator
    readonly emailInput: Locator
    readonly registrationEmailCheckbox: Locator
    readonly phoneNumberInput: Locator
    readonly startDateInput: Locator
    readonly jobTitleInput: Locator
    readonly saveEmployeeButton: Locator
    readonly addAnotherEmployeeButton: Locator
    readonly goToProfileButton: Locator
    readonly closePopupButton: Locator
    readonly editUserButton: Locator

    employeeId: string
    employeeHref: Locator
    startDateDayInput: Locator

    constructor(page: Page) {
        this.page = page
        this.addEmployeeButton = page.getByText('Add employee')
        this.employeeSearchInput = page.getByPlaceholder('Name or job title...')
        this.firstNameInput = page.locator('#firstName')
        this.lastNameInput = page.locator('#lastName')
        this.emailInput = page.locator('#email')
        this.registrationEmailCheckbox = page.locator('#registrationEmail')
        this.phoneNumberInput = page.locator('#phoneNumber')
        this.startDateInput = page.locator('[data-testid="input-selector"]>span')
        this.jobTitleInput = page.locator('#jobTitle')
        this.saveEmployeeButton = page.getByText('Save new employee')
        this.addAnotherEmployeeButton = page.getByText('Add another employee')
        this.goToProfileButton = page.getByText('Go to profile')
        this.closePopupButton = page.locator('[aria-label="Close modal"]')
        this.editUserButton = page.locator('[data-testid="EditButton"]')
    }

    async openAddEmployeeForm() {
        await expect(this.addEmployeeButton).toBeVisible()
        await expect(this.addEmployeeButton).toBeEnabled()
        await this.addEmployeeButton.click()
        await expect(this.firstNameInput).toBeVisible()
    }

    async fillOutEmployeeForm(employee: Employee) {
        await this.firstNameInput.fill(employee.firstName)
        await expect(this.lastNameInput).toBeEditable()
        await this.lastNameInput.fill(employee.lastName)
        await expect(this.emailInput).toBeEditable()
        await this.emailInput.fill(employee.email)
        if (employee.registrationEmail==true) {
            if (!await this.registrationEmailCheckbox.isChecked()) {
                await this.registrationEmailCheckbox.evaluate((node: HTMLElement) => node.click())
                await expect(this.registrationEmailCheckbox).toBeChecked();
            }
        }
        if (employee.registrationEmail==false) {
            if (await this.registrationEmailCheckbox.isChecked()) {
                await this.registrationEmailCheckbox.evaluate((node: HTMLElement) => node.click())
                expect(await this.registrationEmailCheckbox.isChecked()).toBeFalsy();
            }
        }
        if (employee.phoneNumber!=null) {
            await expect(this.phoneNumberInput).toBeEditable()
            await this.phoneNumberInput.fill(employee.phoneNumber)
        }
        if (employee.startDate!=null) {
            await expect(this.startDateInput).toBeEditable()
            await this.startDateInput.click()
            this.startDateDayInput = this.page.locator('[class="DayPicker-Day-Number"]').filter({ hasText: `${employee.startDate}` })
            await expect(this.startDateDayInput).toBeVisible()
            await this.startDateDayInput.click()
        }
        if (employee.jobTitle!=null) {
            await expect(this.jobTitleInput).toBeEditable()
            await this.jobTitleInput.fill(employee.jobTitle)
        }
    }

    async saveEmployee () {
        await expect(this.saveEmployeeButton).toBeVisible()
        await expect(this.saveEmployeeButton).toBeEnabled()
        await this.saveEmployeeButton.click()
        await expect(this.addAnotherEmployeeButton).toBeVisible()
        this.employeeId = await this.goToProfileButton.getAttribute('href');
        return this.employeeId
    }

    async closeEmployeeSuccessPopup () {
        await expect(this.closePopupButton).toBeVisible()
        await expect(this.closePopupButton).toBeEnabled()
        await this.closePopupButton.click()
        await this.addAnotherEmployeeButton.isHidden()
    }

    async verifyEmployeeIsSavedWithSearch(employee: Employee) {
        await expect(this.employeeSearchInput).toBeVisible()
        await this.employeeSearchInput.clear()
        await this.employeeSearchInput.fill(`${employee.lastName}`) //noticed a bug, that search by full name brings no result
        await expect(this.editUserButton).toHaveCount(1)
        await this.employeeSearchInput.clear()
    }

    async verifyEmployeeIsSavedOnPage(employeeId: string) {
        this.employeeHref = this.page.locator(`xpath=//a[@href='${employeeId}']`)
        await expect(this.employeeHref).toBeVisible()
    }
}
