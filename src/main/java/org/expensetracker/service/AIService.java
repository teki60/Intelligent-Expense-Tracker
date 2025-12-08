package org.expensetracker.service;

import org.aspectj.bridge.Message;
import org.expensetracker.dto.AI.CategorizeTransactionRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class AIService {

    private final WebClient webClient;

//    @Value("${chatgroq.api-key}")
//    private String apiKey;

    public AIService(WebClient.Builder webClientBuilder){
        this.webClient = webClientBuilder
                .baseUrl("https://api.groq.com/openai/v1")
                .build();
    }

    public String categorizeTransaction(String description){

        String prompt = "Categorize this expense into one of [Food, Travel, Shopping, Movies, Bills, Subscriptions, Others]. "+
                        "Just give me the response in a single word either Food/travel etc no need of any explanations"+
                        "Expense description: "+description;

        // Map<String,Object> requestBody = Map.of(
        //         "model","llama-3.3-70b-versatile",
        //         "messages", new Object[]{
        //                 Map.of("role","system","content","You are an expense categorization assistant"),
        //                 Map.of("role","user","content",prompt)
        //         }
        // );

        CategorizeTransactionRequest categorizeTransactionRequest = new CategorizeTransactionRequest(
                "llama-3.3-70b-versatile",
                List.of(
                        new Message("system","You are an expense categorization assistant"),
                        new Message("user",prompt)
                )
        );

        Map<String,Object> response = webClient.post()
                .uri("/chat/completions")
                .header("Authorization","Bearer "+apiKey)
                .bodyValue(categorizeTransactionRequest)
                .retrieve()
                .bodyToMono(Map.class)
                .block();


        List<Map<String,Object>> choices = (List<Map<String, Object>>) response.get("choices");
        Map<String,Object> choice1 = choices.get(0);
        Map<String,String> message = (Map<String, String>) choice1.get("message");
        String content = message.get("content");

        return content;
    }
}
