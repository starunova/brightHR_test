import {test as setup, expect} from '@playwright/test';
import {user_1} from "../utils/authentification/testUsers";
import {testConfig} from "../testConfig";

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

const user_1_file = (process.env.CI ? process.env.CI_PROJECT_DIR + '/playwright/' : '') + 'tests/.auth/user_1.json';

setup('authenticate', async ({ page }) => {
    // Perform authentication steps. Replace these actions with your own.
    await page.goto(`${testConfig[process.env.ENV]}/login`);
    await page.locator('#email').fill(user_1.email, {timeout: 15000});
    await page.locator('#password').fill(user_1.password, {timeout: 15000});
    await page.getByRole('button').filter({ hasText: 'Login' }).click();
    await page.waitForURL(`${testConfig[process.env.ENV]}/dashboard`);
    await page.context().storageState({ path: user_1_file });
});


/*setup('authenticate as user', async ({ request}) => {
    const getTokenResponse = await request.get(`${process.env.ENV}/api/antiforgery/token`, {
        timeout: 20000
    });
    await delay(2000)
    await expect(getTokenResponse).toBeOK();
    const tokenHeaders = getTokenResponse.headersArray();
    console.log(tokenHeaders)

    const loginResponse = await request.post(`${process.env.ENV}/api/login`, {
        data: {
            'X-XSRF-TOKEN': "",
            'email': user_1.email,
            'password': user_1.password
        }, timeout: 20000
    });
    const sendTokenResponse = await request.post(`${process.env.ENV}/connect/token`, {
        data: {

        }, timeout: 20000
    });

    await request.storageState({ path: user_1_file });
});*/


