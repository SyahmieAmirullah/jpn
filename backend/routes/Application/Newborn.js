import express from 'express';
import { execute } from "../../config/db.js";

const router = express.Router();

router.post('/1', async (req, res) => {
  const {citizenID, fatherID,motherID,babyName,gender,dob,religion,race,address } = req.body;

  try {
    // Step 1: Get next appID from application sequence
    const appIDResult = await execute(`SELECT application_seq.NEXTVAL AS appID FROM dual`);
    const appID = appIDResult.rows[0].APPID;

    // Step 2: Insert into application table
    await execute(
      `INSERT INTO application (appID, citizenID, appType, appDate)
       VALUES (:1, :2, 'NEWBORN', SYSDATE)`,
      [appID, citizenID]
    );

    // Step 3: Get next nbAppID from newborn_application sequence
    const nbAppIDResult = await execute(`SELECT newborn_application_seq.NEXTVAL AS nbAppID FROM dual`);
    const nbAppID = nbAppIDResult.rows[0].NBAPPID;

    // Step 4: Insert into newborn_application with its own nbAppID, and link to appID
    await execute(
  `INSERT INTO NEWBORN_APPLICATION(nbAppID, APPID, fatherID, motherID,
    babyName, gender, date_of_birth, religion, race, address)
   VALUES (:1, :2, :3, :4, :5, :6, TO_DATE(:7, 'YYYY-MM-DD'), :8, :9, :10)`,
  [nbAppID, appID, fatherID, motherID, babyName, gender,
    dob, religion, race, address]
);

    // Step 5: Commit
    await execute('COMMIT');

    // Step 6: Send success response
    res.status(201).json({
      success: true,
      message: 'Newborn Application sent successfully',
      application: {
        appID,
        nbAppID
      }
    });

  } catch (err) {
    console.error('Application error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/checkICName', async (req, res) => {
  const { fullname, icno } = req.body;

const cleanedFullname = fullname.replace(/_/g, ' ').trim().toUpperCase();
const cleanedICNo = icno.replace(/[^0-9]/g, '');

console.log('Cleaned IC:', cleanedICNo); // Should be '890112031453'
console.log('Cleaned Name:', cleanedFullname); // Should be 'LEE CHONG WEI'

  try {
    const result = await execute(
      `SELECT citizenID as "citizenID" FROM citizen 
        WHERE icno = (:1)
        AND UPPER(full_name) = upper(:2)`,
      [ cleanedICNo , cleanedFullname]  // this is NOT safe for real apps, but okay for learning
    );


    const user = result.rows[0];

     res.json({
      success: result.rows.length > 0,
      match: result.rows.length > 0,
      message: result.rows.length > 0 
        ? 'Match icno and full name' 
        : 'Unmatch icno and full name',
        user:
        {
          citizenID:user.citizenID,
        }
    });

  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

export default router;