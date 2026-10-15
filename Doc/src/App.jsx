import RegisterDoctor from './component/Admin/RegisterDoctor'
import DocAppointments from './component/Doctor/DocAppointments'
import Login from './component/Login/Login'
import User from './component/Login/User'
// import Appointment from './component/User/Appointment'
import BookAppointment from './component/User/BookAppointment'
import CompanionPage from './component/User/CompanionPage'
import DoctorPage from './component/User/DoctorPage'
import DoctorProfile from './component/User/DoctorProfile'
import MyAppointment from './component/User/MyAppointment'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DocDashboard from './component/Doctor/DocDashboard'
import Prescription from './component/Doctor/Prescription'
import Prescriptions from './component/User/Prescriptions'
import Equipment from './component/User/Equipment'
import CompanionCare from './component/Admin/CompanionCare'
import MedicineAdd from './component/Admin/MedicineAdd'
import MedicineStock from './component/Admin/MedicineStock'
import EquipmentRental from './component/Admin/EquipmentRentalAdd'
import ViewbookEquipment from './component/Admin/ViewbookEquipment'
import ViewEquipment from './component/Admin/ViewEquipment'
import EditEquipment from './component/Admin/EditEquipment'
import BookedEquipmentStatus from './component/User/BookedEquipmentStatus'
import CompanionStatus from './component/User/CompanionStatus'
import UserMedicine from './component/User/UserMedicine'
// import UserMedicineOrders from './component/User/UserMedicineOrders'
import StaffRegister from './component/Admin/StaffRegistration'
import ViewStaff from './component/Admin/ViewStaff'
import EditStaff from './component/Admin/EditStaff'
import ViewDoctor from './component/Admin/ViewDoctor'
import EditDoctor from './component/Admin/EditDoctor'
import Staffpage from './component/Staff/Staffpage'
// import StaffMedicineOrders from './component/Staff/StaffMedicineOrders'
// import Companiondet from './component/Staff/Companiondet'
import AdminDashboard from './component/Admin/AdminDashboard'
import CompanionDet from './component/Staff/Companion/Companiondet'
import StaffMedicineOrders from './component/Staff/Pharmacist/StaffMedicineOrders'
import LabBooking from './component/User/LabBooking'
import LabReports from './component/User/LabReports'
import LabsList from './component/User/LabsList'
import LabDetails from './component/User/LabDetails'
import LabTests from './component/User/LabTests'
import ManageLab from './component/Admin/ManageLab'
import LabModule from './component/Lab/LabModule'
import TokenMangement from './component/Admin/TokenMangement'
import ViewPrescription from './component/Doctor/ViewPrescription'
import EditPriscription from './component/Doctor/EditPriscription'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/doctorpage' element={<DoctorPage />} />
          <Route path='/doctorprofile/:doctorId' element={<DoctorProfile />} />
          {/* <Route path='/appointment' element={<Appointment />} /> */}
          <Route path='/bookappointment/:doctorId' element={<BookAppointment />} />
          <Route path='/companionpage' element={<CompanionPage />} />
          <Route path='/myappointment' element={<MyAppointment />} />
          <Route path='/prescriptions' element={<Prescriptions />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/bookequipmentstatus" element={<BookedEquipmentStatus/>}/>
          <Route path='/companionstatus' element={<CompanionStatus/>}/>
          <Route path='/user-medicine' element={<UserMedicine />} />
          {/* <Route path='/user-medicine-orders' element={<UserMedicineOrders />} /> */}
          <Route path='/labbooking' element={<LabBooking/>}/>
          <Route path='/labtests' element={<LabTests/>}/>
          <Route path='/labs' element={<LabsList/>}/>
          <Route path='/labdetails/:labId' element={<LabDetails/>}/>
          <Route path='/labreports' element={<LabReports/>}/>


          <Route path='/docdashboard' element={<DocDashboard />} />
          <Route path='/docappointments' element={<DocAppointments />} />
          <Route path="/prescription/:appointmentId" element={<Prescription />} />
          {/* <Route path='/viewPrescription/:appointmentId' element={<ViewPrescription />} /> */}
          <Route path="/view-prescription/:appointmentId"element={<ViewPrescription />}/>
          <Route path ='/edit-prescription/:appointmentId' element={<EditPriscription/>}/>

          <Route path='/' element={<Login />} />
          <Route path='/userregister' element={<User />} />

          <Route path='/registerdoctor' element={<RegisterDoctor />} />
          <Route path='/doctorview' element={<ViewDoctor />} />
          <Route path='/editdoctor/:doctorid' element={<EditDoctor />} />
          {/* <Route path='/adminequipment' element={<AdminEquipment />} /> */}
          <Route path='/companion' element={<CompanionCare />} />
          <Route path='/medicineAdd' element={<MedicineAdd/>}/>
          <Route path='/medicinestock' element={<MedicineStock/>}/>
          <Route path='/equipmentrental' element={<EquipmentRental/>} />
          <Route path='/equipmentedit/:id' element={<EditEquipment/>}/> 
          <Route path='/viewequipmentbook' element={<ViewbookEquipment/>}/>
          <Route path='/viewequip' element={<ViewEquipment/>}/>
          <Route path="/staffregister"element={<StaffRegister/>}/>
          <Route path='/staffview' element={<ViewStaff/>}/>
          <Route path='/editstaff/:staffid' element={<EditStaff/>}/>
          <Route path='/admindashboard' element={<AdminDashboard/>}/>
          <Route path='/managelab' element={<ManageLab/>}/>


          <Route path='/tokenmanagement' element={<TokenMangement />} />
          <Route path='/tokenlist' element={<TokenMangement />} />

          <Route path='/staffdashboard' element={<Staffpage/>}/>
          <Route path='/staffmedicineorders' element={<StaffMedicineOrders/>}/>
          <Route path='/companiondetail'element={<CompanionDet/>}/>
          <Route path='/labdashboard' element={<LabModule/>}/>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
