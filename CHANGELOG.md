# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [1.5.0](http://neer-bitbucket:7999/gd/gexa-saas/compare/v1.4.0...v1.5.0) (2019-10-09)


### Bug Fixes

* **auth:** bug fix in generate token ([ee94472](http://neer-bitbucket:7999/gd/gexa-saas/commits/ee94472))
* **autopay_service:** fixed a bug in auto pay service ([5b1ff15](http://neer-bitbucket:7999/gd/gexa-saas/commits/5b1ff15))
* **customer_acount:** fix an issue with auth token ([33cccb3](http://neer-bitbucket:7999/gd/gexa-saas/commits/33cccb3))
* **refresh:** changed refresh to be a get that sends refresh token in header ([fd4559d](http://neer-bitbucket:7999/gd/gexa-saas/commits/fd4559d))
* **service_account:** Take fields on post from body of request ([dc1171b](http://neer-bitbucket:7999/gd/gexa-saas/commits/dc1171b))
* **service_accounts:** fix an issue with getting waivers ([f25f8c6](http://neer-bitbucket:7999/gd/gexa-saas/commits/f25f8c6))
* **swagger:** fixed definition used for credits on service accounts ([642d1c2](http://neer-bitbucket:7999/gd/gexa-saas/commits/642d1c2))
* **users:** fix the issue with unlocking users ([6f92299](http://neer-bitbucket:7999/gd/gexa-saas/commits/6f92299))


### Features

* **logging:** added sentry logging to the project ([db20ca1](http://neer-bitbucket:7999/gd/gexa-saas/commits/db20ca1))
* **serivce_account:** api methods to update customer and service accounts ([bff7aa3](http://neer-bitbucket:7999/gd/gexa-saas/commits/bff7aa3))
* **service_account:** add an api method to disconnect a service account ([4ffff27](http://neer-bitbucket:7999/gd/gexa-saas/commits/4ffff27))
* **service_account:** add credit get and post apis ([023c767](http://neer-bitbucket:7999/gd/gexa-saas/commits/023c767))
* **swagger:** updated swagger to include security question for caching ([7c6841d](http://neer-bitbucket:7999/gd/gexa-saas/commits/7c6841d))
* **users:** built the functionality for user accounts ([5e8f1e9](http://neer-bitbucket:7999/gd/gexa-saas/commits/5e8f1e9))



# [1.4.0](http://neer-bitbucket:7999/gd/gexa-saas/compare/v1.3.0...v1.4.0) (2019-09-13)


### Bug Fixes

* **auth:** fix error handling ([cd47d7a](http://neer-bitbucket:7999/gd/gexa-saas/commits/cd47d7a))
* **budget_billing:** Fixed sign up method for budget billing ([77c2d3b](http://neer-bitbucket:7999/gd/gexa-saas/commits/77c2d3b))
* **external_api:** Changed external api calls to use basic auth instead of certs ([5e1cf4b](http://neer-bitbucket:7999/gd/gexa-saas/commits/5e1cf4b))
* **generate_token:** Added Is_Admin claim to generated tokens ([b34c081](http://neer-bitbucket:7999/gd/gexa-saas/commits/b34c081))
* **merge:** Merged from refactor-fixes ([aaa919e](http://neer-bitbucket:7999/gd/gexa-saas/commits/aaa919e))
* **merge:** merged with refactor-fixes branch ([97e1f7b](http://neer-bitbucket:7999/gd/gexa-saas/commits/97e1f7b))
* **merge:** merged with refactor-fixes branch ([ceb3a3f](http://neer-bitbucket:7999/gd/gexa-saas/commits/ceb3a3f))
* **notes:** Added notes section to swagger ([b816bbc](http://neer-bitbucket:7999/gd/gexa-saas/commits/b816bbc))
* **payment_extension:** Changed payment extension to accept extend instead of a date ([33d66a4](http://neer-bitbucket:7999/gd/gexa-saas/commits/33d66a4))
* **service_accounts:** Fixed service account naming and added error handling to notification options ([29b96ed](http://neer-bitbucket:7999/gd/gexa-saas/commits/29b96ed))
* **suspension_letters:** Changed suspension letter implementation ([55114bf](http://neer-bitbucket:7999/gd/gexa-saas/commits/55114bf))
* **validation:** Fixed validation helper to pull from new swagger spec ([8d8dad2](http://neer-bitbucket:7999/gd/gexa-saas/commits/8d8dad2))
* **waivers:** add only admin access to work with waivers ([8e96f34](http://neer-bitbucket:7999/gd/gexa-saas/commits/8e96f34))


### Features

* **auth:** add preauthtoken verification ([fe59085](http://neer-bitbucket:7999/gd/gexa-saas/commits/fe59085))
* **authentication:** added code for saving auth, invoice download, suspension and reject info for a ([3d1887f](http://neer-bitbucket:7999/gd/gexa-saas/commits/3d1887f))
* **autopay:** Added get, create and delete for autopay at service account level ([baf6f1e](http://neer-bitbucket:7999/gd/gexa-saas/commits/baf6f1e))
* **autopay:** Enabled the post for autopay to update as well as create ([31102ca](http://neer-bitbucket:7999/gd/gexa-saas/commits/31102ca))
* **budget_billing:** Added budget billing endpoints for service accounts ([db45296](http://neer-bitbucket:7999/gd/gexa-saas/commits/db45296))
* **correspondence:** correspondence ([3f325ed](http://neer-bitbucket:7999/gd/gexa-saas/commits/3f325ed))
* **custom_error:** Added custom error class and used it in autopay and paymethod service ([9552dc0](http://neer-bitbucket:7999/gd/gexa-saas/commits/9552dc0))
* **customer_account:** added notes functionality to customer account ([74e169a](http://neer-bitbucket:7999/gd/gexa-saas/commits/74e169a))
* **customer_correspondence:** added disconnect letter info ([5ff3690](http://neer-bitbucket:7999/gd/gexa-saas/commits/5ff3690))
* **fuzzy_search:** added fuzzy search, abitlity to add notes ([d99968b](http://neer-bitbucket:7999/gd/gexa-saas/commits/d99968b))
* **getCSPNotes:** GMMMINOR-88:Create API to pull the last X notes ([924a458](http://neer-bitbucket:7999/gd/gexa-saas/commits/924a458))
* **getCSPNotes:** GMMMINOR-88:Create API to pull the last X notes ([f389a6e](http://neer-bitbucket:7999/gd/gexa-saas/commits/f389a6e))
* **getCSPNotes:** post CSP note ([a20a673](http://neer-bitbucket:7999/gd/gexa-saas/commits/a20a673))
* **gulp_update:** gulp_update ([d4b55bd](http://neer-bitbucket:7999/gd/gexa-saas/commits/d4b55bd))
* **logging:** logging ([1d586de](http://neer-bitbucket:7999/gd/gexa-saas/commits/1d586de))
* **mygexa:** added a bunch of stuff for mygexa ([459e7b4](http://neer-bitbucket:7999/gd/gexa-saas/commits/459e7b4))
* **new_methods:** Added endpoints and specs for new functionality ([e43d514](http://neer-bitbucket:7999/gd/gexa-saas/commits/e43d514))
* **notification_options:** Added methods to get, set and cancel notification options ([9699a5e](http://neer-bitbucket:7999/gd/gexa-saas/commits/9699a5e))
* **pay_method:** Added create, update and delete methods for pay methods ([4c62192](http://neer-bitbucket:7999/gd/gexa-saas/commits/4c62192))
* **Payment_Extension:** fixed the response for payment extension ([fa1c2d1](http://neer-bitbucket:7999/gd/gexa-saas/commits/fa1c2d1))
* **postFuzzySearch:** added fuzzy search ([d4e346b](http://neer-bitbucket:7999/gd/gexa-saas/commits/d4e346b))
* **pre_auth:** Removed old service acct/ssn lookup and replaced with preauth ([cdbab4f](http://neer-bitbucket:7999/gd/gexa-saas/commits/cdbab4f))
* **save_auth:** save_auth ([b8f5cfa](http://neer-bitbucket:7999/gd/gexa-saas/commits/b8f5cfa))
* **service_account:** meter read details for the service account ([e6357c1](http://neer-bitbucket:7999/gd/gexa-saas/commits/e6357c1))
* **service_account:** usage history and meter read details for service account ([c2e6533](http://neer-bitbucket:7999/gd/gexa-saas/commits/c2e6533))
* **service_requests:** add new api methods for waivers and service orders ([faa66c3](http://neer-bitbucket:7999/gd/gexa-saas/commits/faa66c3))
* **services:** Added services for multiple models ([49d6045](http://neer-bitbucket:7999/gd/gexa-saas/commits/49d6045))
* **swagger:** added account_password to save auth api ([8638eb0](http://neer-bitbucket:7999/gd/gexa-saas/commits/8638eb0))
* **swagger:** swagger ([dc484dd](http://neer-bitbucket:7999/gd/gexa-saas/commits/dc484dd))
* **swagger:** swagger ([4ed75c8](http://neer-bitbucket:7999/gd/gexa-saas/commits/4ed75c8))
* **swagger:** swagger update ([6de0f95](http://neer-bitbucket:7999/gd/gexa-saas/commits/6de0f95))
* **swagger:** updated the swagger def with enums ([0c18117](http://neer-bitbucket:7999/gd/gexa-saas/commits/0c18117))
* **token:** Added method that allows the generation of a token based on input ([38abd55](http://neer-bitbucket:7999/gd/gexa-saas/commits/38abd55))
* **waivers:** waivers ([19c4ca3](http://neer-bitbucket:7999/gd/gexa-saas/commits/19c4ca3))



# [1.3.0](http://neer-bitbucket:7999/gd/gexa-saas/compare/v1.2.0...v1.3.0) (2019-05-02)


### Bug Fixes

* **customer_account:** Re-added the claims validation ([da756a2](http://neer-bitbucket:7999/gd/gexa-saas/commits/da756a2))
* **jwt:** Changed issuer requirement ([7f8a556](http://neer-bitbucket:7999/gd/gexa-saas/commits/7f8a556))
* **swagger:** App.js fixes for new swagger docs ([fd24411](http://neer-bitbucket:7999/gd/gexa-saas/commits/fd24411))


### Features

* **customer_account:** Added documentation for swagger ([729d045](http://neer-bitbucket:7999/gd/gexa-saas/commits/729d045))
* **ESIIDsearch:** Added ability to search based on address ([bd8c640](http://neer-bitbucket:7999/gd/gexa-saas/commits/bd8c640))



# [1.2.0](http://neer-bitbucket:7999/gd/gexa-saas/compare/v1.1.0...v1.2.0) (2019-03-12)


### Features

* **service_accounts:** Added specs and endpoints for service accounts ([cd9a470](http://neer-bitbucket:7999/gd/gexa-saas/commits/cd9a470))



# 1.1.0 (2019-03-11)


### Bug Fixes

* **external_api:** Fixed query string functionality ([f6d6d57](http://neer-bitbucket:7999/gd/gexa-saas/commits/f6d6d57))


### Features

* **customer_account:** First commit, added swagger specs and endpoint for getting customer by id ([278fb4c](http://neer-bitbucket:7999/gd/gexa-saas/commits/278fb4c))
* **invoices:** Added specs and functionality for invoices ([a0698ca](http://neer-bitbucket:7999/gd/gexa-saas/commits/a0698ca))
