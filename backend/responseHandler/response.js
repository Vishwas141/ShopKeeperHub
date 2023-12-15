
const response = function (code, data,res)
{
    if (code == 200 || code == 201 || code == 202 || code == 203 || code == 204)
    {
         res.status(code).json({
            success: true,
            data
         })
        return res;
    }
    else
    {
        return res.status(code).json(
            {
                success: false,
                data:data
            }
        )
    }
}

module.exports = response;