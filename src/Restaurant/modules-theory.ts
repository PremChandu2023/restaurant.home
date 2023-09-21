/**
 * Modules ==>  providers defined in a module are visible to other members of the module without the need to export them. When a provider needs to be visible outside of a module, it is first exported from its host module, and then imported into its consuming module.


//Feature Modules :==>
/**
 *  Modules act as containers for related components, services, controllers, providers, and other entities. They help in achieving separation of concerns by grouping related functionality together and promoting code reusability. 

// Feature Modules are a specific type of modules in Nest.js that are used to organize functionality related to specific features of your application. Each feature module typically represents a distinct feature or domain of your application.

//Shared modules :

// In Nest.js, a Shared Module is a special type of module used to organize and provide components, services, and utilities that are intended to be shared and used across multiple other modules in the application. The primary purpose of the Shared Module is to promote code reusability, reduce duplication.

//The Shared Module typically includes providers, services, helpers, utilities, pipes, and other components that are not specific to a particular feature or module but are required by multiple modules throughout the application.

//Global modules :

// In Nest.js, Global Modules are a special type of module that provides a way to make certain providers and services available globally throughout the entire application without the need for explicit importing in each module. Global modules are useful for setting up shared functionality, configuration, or services that need to be available application-wide.*/