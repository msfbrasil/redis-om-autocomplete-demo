package com.redis.om.autocomplete.repository;

import java.util.List;

import com.redis.om.autocomplete.domain.Customer;
import com.redis.om.spring.autocomplete.Suggestion;
import com.redis.om.spring.repository.RedisDocumentRepository;
import com.redis.om.spring.repository.query.autocomplete.AutoCompleteOptions;


public interface CustomersRepository extends RedisDocumentRepository<Customer, String> {
  List<Suggestion> autoCompleteName(String query);
  List<Suggestion> autoCompleteName(String query, AutoCompleteOptions options);
}
