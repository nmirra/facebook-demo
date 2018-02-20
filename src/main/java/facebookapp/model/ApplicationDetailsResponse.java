package facebookapp.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class ApplicationDetailsResponse {

    private long id;
    private String name;
    private String namespace;

    @JsonProperty("contact_email")
    private String contactEmail;

    @JsonProperty("website_url")
    private String websiteUrl;
}
