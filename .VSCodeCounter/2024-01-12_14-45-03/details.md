# Details

Date : 2024-01-12 14:45:03

Directory c:\\Users\\sermo\\OneDrive\\desktop\\Codezz\\Job-Order-Management-System\\app

Total : 55 files,  2061 codes, 542 comments, 610 blanks, all 3213 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [app/Console/Kernel.php](/app/Console/Kernel.php) | PHP | 15 | 7 | 6 | 28 |
| [app/Exceptions/Handler.php](/app/Exceptions/Handler.php) | PHP | 17 | 9 | 5 | 31 |
| [app/Http/Controllers/AssignPersonnelController.php](/app/Http/Controllers/AssignPersonnelController.php) | PHP | 135 | 30 | 45 | 210 |
| [app/Http/Controllers/AuthController.php](/app/Http/Controllers/AuthController.php) | PHP | 93 | 17 | 21 | 131 |
| [app/Http/Controllers/Controller.php](/app/Http/Controllers/Controller.php) | PHP | 9 | 0 | 4 | 13 |
| [app/Http/Controllers/DashboardController.php](/app/Http/Controllers/DashboardController.php) | PHP | 22 | 2 | 9 | 33 |
| [app/Http/Controllers/DeploymentDataController.php](/app/Http/Controllers/DeploymentDataController.php) | PHP | 15 | 0 | 6 | 21 |
| [app/Http/Controllers/EquipmentController.php](/app/Http/Controllers/EquipmentController.php) | PHP | 46 | 8 | 12 | 66 |
| [app/Http/Controllers/FacilityFormController.php](/app/Http/Controllers/FacilityFormController.php) | PHP | 244 | 65 | 77 | 386 |
| [app/Http/Controllers/GetNotificationController.php](/app/Http/Controllers/GetNotificationController.php) | PHP | 94 | 19 | 26 | 139 |
| [app/Http/Controllers/InspectionFormController.php](/app/Http/Controllers/InspectionFormController.php) | PHP | 250 | 88 | 94 | 432 |
| [app/Http/Controllers/UserController.php](/app/Http/Controllers/UserController.php) | PHP | 92 | 24 | 26 | 142 |
| [app/Http/Controllers/VehicleFormController.php](/app/Http/Controllers/VehicleFormController.php) | PHP | 110 | 23 | 38 | 171 |
| [app/Http/Kernel.php](/app/Http/Kernel.php) | PHP | 41 | 21 | 7 | 69 |
| [app/Http/Middleware/Authenticate.php](/app/Http/Middleware/Authenticate.php) | PHP | 11 | 3 | 4 | 18 |
| [app/Http/Middleware/EncryptCookies.php](/app/Http/Middleware/EncryptCookies.php) | PHP | 8 | 6 | 4 | 18 |
| [app/Http/Middleware/PreventRequestsDuringMaintenance.php](/app/Http/Middleware/PreventRequestsDuringMaintenance.php) | PHP | 8 | 6 | 4 | 18 |
| [app/Http/Middleware/RedirectIfAuthenticated.php](/app/Http/Middleware/RedirectIfAuthenticated.php) | PHP | 20 | 5 | 6 | 31 |
| [app/Http/Middleware/TrimStrings.php](/app/Http/Middleware/TrimStrings.php) | PHP | 11 | 5 | 4 | 20 |
| [app/Http/Middleware/TrustHosts.php](/app/Http/Middleware/TrustHosts.php) | PHP | 12 | 5 | 4 | 21 |
| [app/Http/Middleware/TrustProxies.php](/app/Http/Middleware/TrustProxies.php) | PHP | 14 | 10 | 5 | 29 |
| [app/Http/Middleware/ValidateSignature.php](/app/Http/Middleware/ValidateSignature.php) | PHP | 8 | 11 | 4 | 23 |
| [app/Http/Middleware/VerifyCsrfToken.php](/app/Http/Middleware/VerifyCsrfToken.php) | PHP | 8 | 6 | 4 | 18 |
| [app/Http/Requests/AssignPersonnelRequest.php](/app/Http/Requests/AssignPersonnelRequest.php) | PHP | 17 | 8 | 5 | 30 |
| [app/Http/Requests/EquipmentRequest.php](/app/Http/Requests/EquipmentRequest.php) | PHP | 30 | 8 | 5 | 43 |
| [app/Http/Requests/FacilityFormRequest.php](/app/Http/Requests/FacilityFormRequest.php) | PHP | 32 | 8 | 5 | 45 |
| [app/Http/Requests/FormConferenceFacilityRequest.php](/app/Http/Requests/FormConferenceFacilityRequest.php) | PHP | 31 | 8 | 5 | 44 |
| [app/Http/Requests/FormDormFacilityRequest.php](/app/Http/Requests/FormDormFacilityRequest.php) | PHP | 19 | 8 | 5 | 32 |
| [app/Http/Requests/FormMPHFacilityRequest.php](/app/Http/Requests/FormMPHFacilityRequest.php) | PHP | 31 | 8 | 5 | 44 |
| [app/Http/Requests/InspectionFormRequest.php](/app/Http/Requests/InspectionFormRequest.php) | PHP | 32 | 8 | 5 | 45 |
| [app/Http/Requests/LoginRequest.php](/app/Http/Requests/LoginRequest.php) | PHP | 18 | 8 | 5 | 31 |
| [app/Http/Requests/RegisterRequest.php](/app/Http/Requests/RegisterRequest.php) | PHP | 34 | 8 | 5 | 47 |
| [app/Http/Requests/StoreAdminInspectionRequest.php](/app/Http/Requests/StoreAdminInspectionRequest.php) | PHP | 20 | 8 | 5 | 33 |
| [app/Http/Requests/StoreDeploymentDataRequest.php](/app/Http/Requests/StoreDeploymentDataRequest.php) | PHP | 26 | 0 | 5 | 31 |
| [app/Http/Requests/VehicleFormRequest.php](/app/Http/Requests/VehicleFormRequest.php) | PHP | 25 | 8 | 5 | 38 |
| [app/Http/Resources/DeploymentResource.php](/app/Http/Resources/DeploymentResource.php) | PHP | 11 | 5 | 4 | 20 |
| [app/Models/AdminInspectionForm.php](/app/Models/AdminInspectionForm.php) | PHP | 23 | 0 | 7 | 30 |
| [app/Models/AssignPersonnel.php](/app/Models/AssignPersonnel.php) | PHP | 16 | 0 | 6 | 22 |
| [app/Models/DeploymentData.php](/app/Models/DeploymentData.php) | PHP | 21 | 0 | 6 | 27 |
| [app/Models/EquipmentForm.php](/app/Models/EquipmentForm.php) | PHP | 26 | 0 | 6 | 32 |
| [app/Models/Facility_Conference.php](/app/Models/Facility_Conference.php) | PHP | 31 | 0 | 7 | 38 |
| [app/Models/Facility_Dorm.php](/app/Models/Facility_Dorm.php) | PHP | 19 | 0 | 7 | 26 |
| [app/Models/Facility_Form.php](/app/Models/Facility_Form.php) | PHP | 44 | 0 | 11 | 55 |
| [app/Models/Facility_Mph.php](/app/Models/Facility_Mph.php) | PHP | 31 | 4 | 9 | 44 |
| [app/Models/Inspection_Form.php](/app/Models/Inspection_Form.php) | PHP | 38 | 0 | 8 | 46 |
| [app/Models/Inspector_Form.php](/app/Models/Inspector_Form.php) | PHP | 17 | 0 | 5 | 22 |
| [app/Models/PPAUser.php](/app/Models/PPAUser.php) | PHP | 37 | 15 | 9 | 61 |
| [app/Models/User.php](/app/Models/User.php) | PHP | 23 | 16 | 7 | 46 |
| [app/Models/VehicleForm.php](/app/Models/VehicleForm.php) | PHP | 25 | 0 | 8 | 33 |
| [app/Providers/AppServiceProvider.php](/app/Providers/AppServiceProvider.php) | PHP | 12 | 8 | 5 | 25 |
| [app/Providers/AuthServiceProvider.php](/app/Providers/AuthServiceProvider.php) | PHP | 11 | 11 | 5 | 27 |
| [app/Providers/BroadcastServiceProvider.php](/app/Providers/BroadcastServiceProvider.php) | PHP | 12 | 3 | 5 | 20 |
| [app/Providers/EventServiceProvider.php](/app/Providers/EventServiceProvider.php) | PHP | 21 | 12 | 6 | 39 |
| [app/Providers/RouteServiceProvider.php](/app/Providers/RouteServiceProvider.php) | PHP | 24 | 10 | 7 | 41 |
| [app/Rules/DateTimeComparison.php](/app/Rules/DateTimeComparison.php) | PHP | 21 | 0 | 7 | 28 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)