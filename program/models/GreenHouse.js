const express = require('express');
const app = express.Router();
const util = require('util');
const utils = require('../utils');
const db = require('../utils/db');

const query_run = util.promisify(db.query).bind(db);

app.post('/greenhouse/', async (req, res) => {

    try {
        let data = [req.body.name, req.body.img, req.body.site_id];
        let query = 'INSERT INTO greenhouse (name, img, site_id) VALUES (?,?,?)';
        if (req.body.id){
            query = 'update greenhouse  set name = ?, img = ?, site_id = ? WHERE id = ?'+req.body.id;
        }

        let db_query = await db.query(query, data);
        res.json({ success: true });
    }catch (e) {
        console.error('Hata oluştu:', e);
        return res.status(500).json({ error: 'Veritabanına veri eklenirken bir hata oluştu.' });

    }


});

app.get('/greenhouse/', async (req, res) => {

    try {
        // language=SQL format=false
        let query = `
            select 
                *,
                (select light from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as light,  
                (select fan from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as fan,  
                (select temperature from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as temperature,  
                (select humidity from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as humidity, 
                (select magnet from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as magnet,
                (select water_level from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as water_level,
                (select water_motor from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as water_motor
            from greenhouse
        `;

        let db_query = await query_run(query);
        
        return res.json(db_query)
    }catch (e) {
        console.error('Hata oluştu:', e);
        return res.status(500).json({ error: 'Veritabanına veri eklenirken bir hata oluştu.' });

    }
});

app.get('/greenhouse/:id', async (req, res) => {

    try {
        let query = `
            select 
                *,
                (select light from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as light,  
                (select fan from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as fan,  
                (select water_motor from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as water_motor,  
                (select temperature from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as temperature,  
                (select humidity from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as humidity,  
                (select soil_humidity from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as soil_humidity,  
                (select water_level from sensor_data where sensor_data.site_id = greenhouse.site_id  order by createdAt desc limit 1) as water_level  
            from greenhouse  where id=?
        `;

        let db_query = await query_run(query, [req.params.id]);
        res.json(db_query[0])
    }catch (e) {
        console.error('Hata oluştu:', e);
        return res.status(500).json({ error: 'Veritabanına veri eklenirken bir hata oluştu.' });

    }
});

app.delete('/greenhouse/:id', async (req, res) => {
    try {
        let query = 'delete from greenhouse where id=?';
        let db_query = await query_run(query, [req.params.id]);

        return  res.json({ sucess: true });
        console.log(db_query)
    }catch (e) {
        console.error('Hata oluştu:', e);
        return res.status(500).json({ error: 'Veritabanına veri eklenirken bir hata oluştu.' });
    }
});

app.put('/greenhouse/:id/water_motor', async (req, res) => {

    try {
        let site_id = req.params.id;
        console.log('#' + site_id + ' Su Moturu Calistir veya Kapat')
        // Site_id verilen su motoru çalıştır

    }catch (e) {
        console.error('Hata oluştu:', e);
        return res.status(500).json({ error: 'İşlem tamamlanamadı.' });

    }
});

app.put('/greenhouse/:id/fan', async (req, res) => {

    try {
        let site_id = req.params.id;
        console.log('#' + site_id + ' Fan Calistir veya Kapat')
        // Site_id verilen fan çalıştır

    }catch (e) {
        console.error('Hata oluştu:', e);
        return res.status(500).json({ error: 'İşlem tamamlanamadı.' });

    }
});

app.put('/greenhouse/:id/light', async (req, res) => {

    try {
        let site_id = req.params.id;
        console.log('#' + site_id + ' Isik Calistir veya Kapat')
        // Site_id verilen ışık çalıştır

    }catch (e) {
        console.error('Hata oluştu:', e);
        return res.status(500).json({ error: 'İşlem tamamlanamadı.' });

    }
});

module.exports = app;