package com.yellowkart.ai;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import java.util.Map;
import com.yellowkart.ai.logging.YkTrace;

@Provider
public class IllegalArgumentExceptionMapper implements ExceptionMapper<IllegalArgumentException> {

    @Override
    public Response toResponse(IllegalArgumentException exception) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("IllegalArgumentExceptionMapper", "toResponse")) {
            return Response.status(Response.Status.BAD_REQUEST).entity(Map.of("error", exception.getMessage())).build();
        }
    }
}
