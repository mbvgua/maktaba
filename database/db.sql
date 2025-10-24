USE mkatabu;
GO

BEGIN TRY
    INSERT INTO customers (id, name, email) VALUES ('1', 'John Doe', 'johndoe@example.com');
    PRINT 'Data inserted successfully.';
END TRY
BEGIN CATCH
    PRINT 'An error occurred: ' + ERROR_MESSAGE();
END CATCH;
GO
