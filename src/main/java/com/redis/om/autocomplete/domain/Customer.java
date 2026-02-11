package com.redis.om.autocomplete.domain;

import org.springframework.data.annotation.Id;

import com.redis.om.spring.annotations.Document;
import com.redis.om.spring.annotations.AutoComplete;
import com.redis.om.spring.annotations.AutoCompletePayload;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor(staticName = "of")
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Document("customer")
public class Customer {
  @Id
  private String id;
  @AutoComplete @NonNull
  private String name;
  @AutoCompletePayload("name") @NonNull
  private String primaryDocumentNumber;
  @AutoCompletePayload("name") @NonNull
  private String operator;
}
