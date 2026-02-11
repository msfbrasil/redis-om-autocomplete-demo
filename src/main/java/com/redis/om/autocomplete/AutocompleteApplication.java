package com.redis.om.autocomplete;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.google.common.io.Files;
import com.redis.om.autocomplete.domain.Airport;
import com.redis.om.autocomplete.domain.Customer;
import com.redis.om.autocomplete.repository.AirportsRepository;
import com.redis.om.autocomplete.repository.CustomersRepository;
import com.redis.om.spring.annotations.EnableRedisDocumentRepositories;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@SpringBootApplication
@EnableRedisDocumentRepositories
public class AutocompleteApplication {

  @Bean
  public CommandLineRunner loadAirportData(
      AirportsRepository airportsRepository, @Value("classpath:/data/airport_codes.csv") File airportsDataFile) throws IOException {
    return args -> {
      airportsRepository.deleteAll();
      List<Airport> airportsData = Files //
          .readLines(airportsDataFile, StandardCharsets.UTF_8) //
          .stream() //
          .map(l -> l.split(",")) //
          .map(ar -> Airport.of(ar[0], ar[1], ar[2])) //
          .collect(Collectors.toList());
      airportsRepository.saveAll(airportsData);
    };
  }

  @Bean
  public CommandLineRunner loadCustomerData(
      CustomersRepository customersRepository, @Value("classpath:/data/customers_data_partial_200.csv") File customersDataFile) throws IOException {
    return args -> {
      customersRepository.deleteAll();
      List<Customer> customersData = new ArrayList<>();
      AtomicInteger storedRecords = new AtomicInteger();
      AtomicInteger skippedRecords = new AtomicInteger();
      Files.readLines(customersDataFile, StandardCharsets.UTF_8).forEach(currentLine -> {
        String[] currentLineTokens = currentLine.split(",");
        if ( currentLineTokens.length == 6) {
          customersData.add(Customer.of(
                  //Long.valueOf(currentLineTokens[0]),
                  currentLineTokens[1].replaceAll("\"", ""),
                  //currentLineTokens[2].replaceAll("\"", ""),
                  currentLineTokens[3].replaceAll("\"", ""),
                  //Long.valueOf(currentLineTokens[4]),
                  currentLineTokens[5].replaceAll("\"", "")));
          storedRecords.getAndIncrement();
        } else {
          System.out.println( "Skipping process of line: " + currentLine );
          skippedRecords.getAndIncrement();
        }
      });
      System.out.println( "Stored [" + storedRecords.get() + "] and skipped [" + skippedRecords.get() + "] records." );
      customersRepository.saveAll(customersData);
    };
  }

  @Bean
  public OpenAPI apiInfo() {
    return new OpenAPI().info(new Info().title("Redis OM Auto-complete").version("1.0.0"));
  }

  @Bean
  public GroupedOpenApi httpApi() {
    return GroupedOpenApi.builder()
        .group("http")
        .pathsToMatch("/**")
        .build();
  }

  public static void main(String[] args) {
    SpringApplication.run(AutocompleteApplication.class, args);
  }
}
