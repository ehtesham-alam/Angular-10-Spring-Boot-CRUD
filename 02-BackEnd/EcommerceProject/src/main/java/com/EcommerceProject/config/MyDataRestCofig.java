package com.EcommerceProject.config;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.EcommerceProject.entity.Country;
import com.EcommerceProject.entity.Product;
import com.EcommerceProject.entity.ProductCategory;
import com.EcommerceProject.entity.State;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;

@Configuration
public class MyDataRestCofig implements RepositoryRestConfigurer {

	private EntityManager entityManager;

	@Autowired
	public MyDataRestCofig(EntityManager theEntityManager) {
		entityManager = theEntityManager;

	}

//	private EntityManager
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

		HttpMethod[] unsuportedActions = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE };

		

		// Disable HTTP method for product-category PUT POST AND DELETE
		disableHttpMethods(Product.class, config, unsuportedActions);
		disableHttpMethods(ProductCategory.class, config, unsuportedActions);
		disableHttpMethods(Country.class, config, unsuportedActions);
		disableHttpMethods(State.class, config, unsuportedActions);

		// call an external helper method
		exposeIds(config);

	}

private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] unsuportedActions) {
	config.getExposureConfiguration().forDomainType(theClass)
			.withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsuportedActions))
			.withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsuportedActions));
}

	private void exposeIds(RepositoryRestConfiguration config) {

		// expose entity ids
		//
		// -get a list of all entity classes from the entity manager
		java.util.Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

		// - ceate an array of the entity type
		List<Class> entityClasses = new ArrayList<>();

		// - get the entity typw for the entity types
		for (EntityType tempEntityType : entities) {
			entityClasses.add(tempEntityType.getJavaType());

		}
		// - expose the entity ids for the array of entity/domain types
		Class[] domainTypes = entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes);
	}
}