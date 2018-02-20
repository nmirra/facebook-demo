package facebookapp.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class PageDetailsResponse {

    private long id;
    private String name;
    private String description;

    @JsonProperty("full_picture")
    private String fullPicture;

}
