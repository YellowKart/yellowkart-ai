package com.yellowkart.ai;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.Map;
import com.yellowkart.ai.logging.YkTrace;

@Provider
public class IllegalStateExceptionMapper implements ExceptionMapper<IllegalStateException> {

    @Override
    public Response toResponse(IllegalStateException exception) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("IllegalStateExceptionMapper", "toResponse")) {
            return Response.status(Response.Status.SERVICE_UNAVAILABLE).entity(Map.of("error", exception.getMessage())).build();
        }
    }
}
