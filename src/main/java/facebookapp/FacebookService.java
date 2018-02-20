package facebookapp;

import javax.inject.Inject;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.social.connect.UsersConnectionRepository;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.api.impl.FacebookTemplate;
import org.springframework.social.facebook.connect.FacebookConnectionFactory;
import org.springframework.social.oauth2.AccessGrant;
import org.springframework.social.oauth2.OAuth2Operations;
import org.springframework.social.oauth2.OAuth2Parameters;
import org.springframework.stereotype.Service;

import facebookapp.model.ApplicationDetailsResponse;
import org.springframework.web.client.RestTemplate;

@Service
public class FacebookService {

    protected String FACEBOOK_GRAPH_ENDPOINT_URL = "https://graph.facebook.com";

    @Value("${spring.social.facebook.appId}")
    private String applicationId;

    @Value("${spring.social.facebook.appSecret}")
    private String applicationSecret;

    @Value("${spring.social.facebook.pageId}")
    private String pageId;

    @Value("${spring.social.facebook.userId}")
    private String userId;

    public static String token = "EAAdHJOx4m6cBABYEowKZBuHvw7iZBu6aTVHsQKhu5Dm0G52Kqs8BDcNnECP1pKF4E2ZA0KgpIZB4q0gNcR4kliyqvWQrPtgUDQtNZBF1Sh2QsHXVAJ7QZABSSDimdZAZB8jVBivafZB6hQpM2bVBriXGUZATREqv3jtFQGsZCKxZBMUGuiEJXwZAlVb4JjRAmIeCc160X7dZCRFn0eNwZDZD";

    @Inject
    private UsersConnectionRepository usersConnectionRepository;

    public void testConnection() {
        System.out.println("TEST");
    }

    //private ApplicationDetailsResponse bla() {
    //    ResponseEntity<ApplicationDetailsResponse> response = restTemplate.getForEntity("http://localhost:8080/connect", ApplicationDetailsResponse.class);
    //    return response.getBody();
    //}

    //public String fetchApplicationAccessToken() {
    //    OAuth2Operations oauth = new FacebookConnectionFactory(applicationId, applicationSecret).getOAuthOperations();
    //    AccessGrant accessGrant = oauth.authenticateClient();
    //    return accessGrant.getAccessToken();
    //}


    //public ApplicationDetailsResponse fetchApplicationDetails() {
    //    Facebook facebook = new FacebookTemplate(fetchApplicationAccessToken());
    //    return facebook.restOperations().getForObject(FACEBOOK_GRAPH_ENDPOINT_URL + "/{appId}?fields=name,namespace,contact_email,website_url",
    //            ApplicationDetailsResponse.class, applicationId);

        //me?fields=accounts
   // }

}
