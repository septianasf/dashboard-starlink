const express = require('express');
const mysql = require('mysql2/promise');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();

const dbConfig = {
    host: 'localhost',
    user: 'falahtec_starlink',
    password: '53pt14N4',
    database: 'falahtec_dashboard_starlink'
};

// 15 AKUN MASTER STARLINK
const ACCOUNTS_MASTER = [
    { nickname: 'PUSPALAD 01 t', kit: 'KIT4M03940234SM4', clientId: '6b3b899c-c576-4e26-8e91-dcc28d343df2', clientSecret: 'spx_df_bY1tGPLRjLHuEmXa-0znSZIZdLm-xFgs1qY2LrxdYezUdys1', pStart: '2026-08-14', pEnd: '2026-09-14' },
    { nickname: 'PUSPALAD 02', kit: 'KIT4M03940250ZMX', clientId: '25a2ff81-f117-4032-99a2-a725ecd9ef35', clientSecret: 'spx_df_Vpba2Kkrt7Vjboejdhl4en37w02pf9m2EKSWq7UXxiW_4ZIA', pStart: '2026-09-14', pEnd: '2026-10-14' },
    { nickname: 'PUSPALAD 06', kit: 'KIT4M03940244GZH', clientId: '8a2d5796-b8d0-4484-9b6d-4a40774aa2fc', clientSecret: 'spx_df_rQC-AkWrIbH7lflQBtbEL9fPRKZ6jqTiTHhky_5WHMvn2-3y', pStart: '2026-09-14', pEnd: '2026-10-14' },
    { nickname: 'PUSPALAD 10 t', kit: 'KIT4M03940249R4H', clientId: '3ccfc4d0-cc54-47b5-9a4d-66c4a9957ffa', clientSecret: 'spx_df_HWGC5AtH5DQ9uTqlc5psRztsvG_BZwbq2m-8_1Ij3ixlBFh4', pStart: '2026-08-14', pEnd: '2026-09-14' },
    { nickname: 'PUSPALAD 11', kit: 'KIT4M03940247T7W', clientId: 'fd19198c-5d7f-4bae-8274-fbf0c1cc5d67', clientSecret: 'spx_df_-ERSlSUhCSIa9tiJrKFVRLriBItbnij-3icNt_GdCtZo2ZLs', pStart: '2026-09-14', pEnd: '2026-10-14' },
    { nickname: 'PUSPALAD 13', kit: 'KIT4M03940252JN8', clientId: '26a81ca7-918d-486a-b2c3-de605869ea58', clientSecret: 'spx_df_FIGxHVduWbwm0fx_AIom1wXDQonzSgkn0ZCWnQF-5AalAoZH', pStart: '2026-09-14', pEnd: '2026-10-14' },
    { nickname: 'PUSPALAD 16', kit: 'KIT4M03940260CCP', clientId: '2257ee27-63cc-48e6-9d22-fbde646163e6', clientSecret: 'spx_df_RxObwIR80iP9W8UsyVqbXJph_WTpqAZFRDcw66Ha9CIeW4lA', pStart: '2026-09-14', pEnd: '2026-10-14' },
    { nickname: 'PUSPALAD 17', kit: 'KIT4M03940266XDH', clientId: 'dfc8589e-3cbc-4e97-a110-8fa010d8e891', clientSecret: 'spx_df_LjRg6xEQT1y-M5Q5vcMN6KtttDQ1_sdnE88XJpiQD5CTUbgG', pStart: '2026-09-14', pEnd: '2026-10-14' },
    { nickname: 'PUSPALAD 18', kit: 'KIT4M03940258MTK', clientId: 'd71a5b51-d50c-4071-a5f0-5a26c2fcd2cc', clientSecret: 'spx_df_TAbbDwg9Q2NgNdLMC2ic0IqZWAWWW-jDN4-WJNz6InyAOFnZ', pStart: '2026-09-14', pEnd: '2026-10-14' },
    { nickname: 'PUSPALAD 21', kit: 'KIT4M03940256SSV', clientId: 'c3db46aa-23b6-4bd8-8aac-c33b2caf0196', clientSecret: 'spx_df_kAWmxDjaf2XUvHGXyNTj1MAYvcPMpgbHSrqj4LR0M8wKZ9r8', pStart: '2026-09-14', pEnd: '2026-10-14' },
    { nickname: 'PUSPALAD 25 hfhg', kit: 'KIT4M03940279CZ9', clientId: '16facb22-b1db-4b8f-90f9-ddc04d68007b', clientSecret: 'spx_df_YLI32UfPuIiLk8Aq-Md7XIC2AzwsEpCh-t_yeAYsSvhCN1Sf', pStart: '2026-09-14', pEnd: '2026-10-14' },
    { nickname: 'PUSPALAD 30', kit: 'KIT4M039402596GJ', clientId: '6adca912-86ed-48a9-bd4d-c720a60cbdb7', clientSecret: 'spx_df_DIGfbdv8ts_kTpftTRdxsR-W46WnAZbSGnK2ZyHEIUiUtMz2', pStart: '2026-09-14', pEnd: '2026-10-14' },
    { nickname: 'PUSPALAD 31', kit: 'KIT4M03940290HNW', clientId: '6cb46445-36fc-47bd-a4cf-e86301569af9', clientSecret: 'spx_df_mxczMBVb9USE_HQh-CSoDkD1pf7eU69PrbDITfo56wiiUnCg', pStart: '2026-09-14', pEnd: '2026-10-14' },
    { nickname: 'PUSPALAD 32', kit: 'KIT4M039402437VM', clientId: '1f6d4c32-5ba2-456e-b44b-be0f2923a651', clientSecret: 'spx_df_UhTyUEnrgkbvuDGv_it6ALjafbjivYeCzy2IzTV3nU3xJ4Qu', pStart: '2026-09-14', pEnd: '2026-10-14' },
    { nickname: 'PUSPALAD 34', kit: 'KIT4M01446040D64', clientId: '60d53f89-ca36-4365-bc92-c85be9b156ce', clientSecret: 'spx_df_f2PYsbAjfjj4Btv6Vfj7e76fKc7EGLOzsNeLMXTq1aTGMe_o', pStart: '2026-09-14', pEnd: '2026-10-14' }
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// FUNGSI UTAMA PENARIKAN DATA STARLINK REST API
async function fetchDirectStarlinkData(item) {
    let localPriorityGB = 0;
    let otherDataGB = 0;
    let deviceStatus = 'OFFLINE';
    let serviceStatus = 'ACTIVE';

    try {
        // 1. Minta Access Token OAuth2 dari Starlink API
        const tokenRes = await axios.post('https://auth.starlink.com/oauth/v2/token', 
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: item.clientId,
                client_secret: item.clientSecret
            }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 10000
            }
        ).catch(() => null);

        if (tokenRes && tokenRes.data && tokenRes.data.access_token) {
            const accessToken = tokenRes.data.access_token;
            const headers = { Authorization: `Bearer ${accessToken}` };

            // 2. Tarik Daftar Service Lines / Data Billing
            const slRes = await axios.get('https://api.starlink.com/enterprise/v1/account/service-lines', { headers, timeout: 10000 }).catch(() => null);
            
            if (slRes && slRes.data) {
                const lines = Array.isArray(slRes.data) ? slRes.data : (slRes.data.content || [slRes.data]);
                if (lines.length > 0) {
                    const sl = lines[0];

                    if (sl.dataUsageCurrentBillingCycle) {
                        localPriorityGB = Number(sl.dataUsageCurrentBillingCycle.priorityDataUsedGb || sl.dataUsageCurrentBillingCycle.dataUsedGb || 0);
                        otherDataGB = Number(sl.dataUsageCurrentBillingCycle.standardDataUsedGb || sl.dataUsageCurrentBillingCycle.otherDataUsedGb || 0);
                    } else if (sl.dataBlocks) {
                        if (sl.dataBlocks.priorityDataUsedGb !== undefined) localPriorityGB = Number(sl.dataBlocks.priorityDataUsedGb);
                        if (sl.dataBlocks.otherDataUsedGb !== undefined) otherDataGB = Number(sl.dataBlocks.otherDataUsedGb);
                    }

                    if (sl.active !== undefined) {
                        serviceStatus = sl.active ? 'ACTIVE' : 'INACTIVE';
                    }
                }
            }

            // 3. Tarik Status User Terminals / Telemetry
            const utRes = await axios.get('https://api.starlink.com/enterprise/v1/account/user-terminals', { headers, timeout: 10000 }).catch(() => null);
            if (utRes && utRes.data) {
                const uts = Array.isArray(utRes.data) ? utRes.data : (utRes.data.content || [utRes.data]);
                if (uts.length > 0) {
                    const ut = uts[0];
                    if (ut.connected === true || ut.online === true || ut.state === 'CONNECTED' || ut.state === 'ONLINE') {
                        deviceStatus = 'ONLINE';
                    }
                }
            }

            if (localPriorityGB > 0 || otherDataGB > 0) {
                deviceStatus = 'ONLINE';
            }
        } else {
            // Fallback jika API Starlink merespon via SDK Module
            let starlinkModule = await import('@gibme/starlink/enterprise').catch(() => null);
            const StarlinkAPI = starlinkModule ? (starlinkModule.StarlinkAPI || starlinkModule.default?.StarlinkAPI) : null;

            if (StarlinkAPI) {
                const api = new StarlinkAPI(item.clientId, item.clientSecret);
                const accounts = await api.fetch_accounts().catch(() => []);
                if (accounts && accounts.length > 0) {
                    const account = accounts[0];
                    const rawServiceLines = await account.fetch_service_lines().catch(() => []) || [];
                    if (rawServiceLines.length > 0) {
                        const sl = rawServiceLines[0].serviceLine || rawServiceLines[0];
                        if (sl.dataUsageCurrentBillingCycle) {
                            localPriorityGB = Number(sl.dataUsageCurrentBillingCycle.priorityDataUsedGb || 0);
                            otherDataGB = Number(sl.dataUsageCurrentBillingCycle.standardDataUsedGb || 0);
                        }
                        if (localPriorityGB > 0 || otherDataGB > 0) deviceStatus = 'ONLINE';
                    }
                }
            }
        }
    } catch (e) {
        console.error(`Fetch Direct API Error ${item.nickname}:`, e.message);
    }

    return {
        nickname: item.nickname,
        kit_number: item.kit,
        service_status: serviceStatus,
        device_status: deviceStatus,
        kuota_lokal: Math.round(localPriorityGB * 100) / 100,
        kuota_lainnya: Math.round(otherDataGB * 100) / 100,
        periode_start: item.pStart,
        periode_end: item.pEnd,
        latitude: 4.0612,
        longitude: 117.7286
    };
}

async function syncStarlinkToDatabase() {
    let connection;
    let totalSynced = 0;
    try {
        connection = await mysql.createConnection(dbConfig);
        const finalDevices = [];

        for (const item of ACCOUNTS_MASTER) {
            const devData = await fetchDirectStarlinkData(item);
            finalDevices.push(devData);
            await sleep(100);
        }

        if (finalDevices.length > 0) {
            await connection.execute('TRUNCATE TABLE starlink_devices');

            for (const d of finalDevices) {
                const query = `
                    INSERT INTO starlink_devices 
                    (nickname, kit_number, service_status, device_status, kuota_lokal, kuota_lainnya, periode_start, periode_end, latitude, longitude)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                await connection.execute(query, [
                    d.nickname, d.kit_number, d.service_status, d.device_status,
                    d.kuota_lokal, d.kuota_lainnya, d.periode_start, d.periode_end,
                    d.latitude, d.longitude
                ]);
                totalSynced++;
            }
        }
        return totalSynced;
    } catch (err) {
        console.error('DB Sync Error:', err.message);
        return 0;
    } finally {
        if (connection) await connection.end();
    }
}

cron.schedule('*/5 * * * *', () => syncStarlinkToDatabase());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    const publicIndexPath = path.join(__dirname, 'public', 'index.html');
    const rootIndexPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(publicIndexPath)) res.sendFile(publicIndexPath);
    else if (fs.existsSync(rootIndexPath)) res.sendFile(rootIndexPath);
    else res.send('<h2>Server Starlink Normal</h2>');
});

app.get('/api/sync', async (req, res) => {
    try {
        const total = await syncStarlinkToDatabase();
        res.json({ success: true, message: 'Sync selesai', total_synced: total });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/dashboard', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [devices] = await connection.execute('SELECT *, (kuota_lokal + kuota_lainnya) as total_kuota FROM starlink_devices ORDER BY id ASC');
        await connection.end();

        res.json({
            success: true,
            data: devices,
            devices: devices,
            stats: {
                totalUnit: devices.length,
                totalOnline: devices.filter(d => d.device_status === 'ONLINE').length,
                totalOffline: devices.filter(d => d.device_status === 'OFFLINE').length,
                totalActiveService: devices.filter(d => d.service_status === 'ACTIVE').length
            },
            totalUnit: devices.length,
            totalOnline: devices.filter(d => d.device_status === 'ONLINE').length,
            totalOffline: devices.filter(d => d.device_status === 'OFFLINE').length,
            totalActiveService: devices.filter(d => d.service_status === 'ACTIVE').length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 'passenger';
app.listen(PORT, () => console.log('Server running...'));