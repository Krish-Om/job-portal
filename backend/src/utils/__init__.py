'''

This restructuring:
1. Separates password hashing functions into a dedicated module
2. Breaks the circular dependency between user and security modules
3. Moves the User import inside the function where it's needed
4. Maintains all the functionality while fixing the import error

The application should now start without the circular import error.
'''